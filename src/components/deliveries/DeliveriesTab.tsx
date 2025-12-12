import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { deliveriesService } from '../../services/deliveries/deliveriesService';
import type { DeliveryStop, RouteLeg, RouteTotals } from '../../services/deliveries/deliveries.types';

function formatReportDate() {
  return new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: DeliveryStop['status']) {
  if (status === 'completed') return 'completado';
  if (status === 'in_progress') return 'en curso';
  if (status === 'origin') return 'origen';
  return 'pendiente';
}

export function DeliveriesTab({ stops }: { stops: DeliveryStop[] }) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [legs, setLegs] = useState<RouteLeg[]>([]);
  const [totals, setTotals] = useState<RouteTotals>({ distanceKm: '0.00', durationMin: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    setLegs([]);
    setTotals({ distanceKm: '0.00', durationMin: 0 });
    setError(null);
    setLoading(true);

    const statusColors = deliveriesService.getStatusColors();

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    const map = L.map(mapContainerRef.current, {
      center: stops[0]?.position ?? [19.4326, -99.1332],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const createStopIcon = (color: string) =>
      L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -8],
      });

    const bounds = L.latLngBounds([]);

    stops.forEach((stop, index) => {
      const icon = createStopIcon(statusColors[stop.status]);
      const marker = L.marker(stop.position, { icon }).addTo(map);
      marker.bindPopup(`<strong>#${index + 1} ${stop.customer}</strong><br/>Estado: ${getStatusLabel(stop.status)}`);
      bounds.extend(stop.position as any);
    });

    if (stops.length > 0) {
      map.fitBounds(bounds.pad(0.2));
    }

    mapRef.current = map;

    const fetchRoutes = async () => {
      try {
        const computedLegs: RouteLeg[] = [];
        let totalDistanceM = 0;
        let totalDurationS = 0;

        for (let i = 0; i < stops.length - 1; i += 1) {
          const origin = stops[i].position;
          const destination = stops[i + 1].position;

          const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const data = await res.json();

          if (data?.routes?.[0]) {
            const route = data.routes[0];
            totalDistanceM += route.distance;
            totalDurationS += route.duration;

            const coords: [number, number][] = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            const color = statusColors[stops[i + 1].status];

            const leg: RouteLeg = {
              id: `leg-${i}`,
              coords,
              color,
              distanceKm: (route.distance / 1000).toFixed(2),
              durationMin: Math.round(route.duration / 60),
              destination: stops[i + 1].customer,
            };

            computedLegs.push(leg);

            const polyline = L.polyline(coords as any, { color, weight: 5 }).addTo(map);
            polyline.bindPopup(`<strong>Hacia: ${leg.destination}</strong><br/>${leg.distanceKm} km | ${leg.durationMin} min`);

            coords.forEach((p) => bounds.extend(p as any));
          }
        }

        if (computedLegs.length > 0) {
          map.fitBounds(bounds.pad(0.2));
        }

        setLegs(computedLegs);
        setTotals({
          distanceKm: (totalDistanceM / 1000).toFixed(2),
          durationMin: Math.round(totalDurationS / 60),
        });
      } catch (e) {
        setError('No se pudieron calcular las rutas.');
      } finally {
        setLoading(false);
      }
    };

    void fetchRoutes();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [stops]);

  return (
    <div>
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-gray-700">
            <strong>Total:</strong> {totals.distanceKm} km | {totals.durationMin} min estimados
          </div>
          <div className="text-xs text-gray-500">{formatReportDate()}</div>
        </div>
        {loading && <div className="mt-2 text-xs text-gray-500">Calculando rutas...</div>}
        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      </div>

      <div ref={mapContainerRef} className="w-full h-[60vh]" />

      <div className="p-4 border-t border-gray-200">
        <strong className="text-sm text-gray-900">Detalle por tramo:</strong>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {legs.map((leg, index) => (
            <li key={leg.id}>
              Tramo {index + 1} → {leg.destination}: {leg.distanceKm} km, {leg.durationMin} min
            </li>
          ))}
          {legs.length === 0 && !loading && (
            <li className="text-gray-500">No hay tramos para mostrar.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
