import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { businessesService } from '../../services/businesses/businessesService';
import type { Business } from '../../services/businesses/businesses.types';

const MAX_MARKERS = 5000;

export function BusinessesTab() {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const clusterGroupRef = useRef<any>(null);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [selectedActividad, setSelectedActividad] = useState('');
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await businessesService.loadBusinesses();
        setBusinesses(data);
      } catch (e) {
        setError('No se pudieron cargar los negocios.');
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const municipios = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach((b) => {
      if (b.municipio) set.add(b.municipio.trim());
    });
    return Array.from(set).sort();
  }, [businesses]);

  const actividades = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach((b) => {
      if (b.nombre_act) set.add(b.nombre_act.trim());
    });
    return Array.from(set).sort();
  }, [businesses]);

  const hasFilters = selectedMunicipio || selectedActividad || searchTerm;

  useEffect(() => {
    if (!mapContainerRef.current || loading) return;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    const center = businessesService.getVeracruzCenter();
    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    clusterGroupRef.current = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
    });
    map.addLayer(clusterGroupRef.current);
    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loading]);

  useEffect(() => {
    if (!mapRef.current || !clusterGroupRef.current) return;

    clusterGroupRef.current.clearLayers();

    if (!hasFilters) {
      setDisplayCount(0);
      return;
    }

    let filtered = businesses;

    if (selectedMunicipio) {
      filtered = filtered.filter((b) => b.municipio.trim() === selectedMunicipio);
    }

    if (selectedActividad) {
      filtered = filtered.filter((b) => b.nombre_act.trim() === selectedActividad);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.nom_estab.toLowerCase().includes(term) ||
          b.municipio.toLowerCase().includes(term) ||
          b.nombre_act.toLowerCase().includes(term)
      );
    }

    const toShow = filtered.slice(0, MAX_MARKERS);
    setDisplayCount(filtered.length);

    const businessIcon = L.divIcon({
      className: '',
      html: `<div style="width:12px;height:12px;border-radius:9999px;background:#D0323A;border:2px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      popupAnchor: [0, -8],
    });

    const markers = toShow.map((business) => {
      const marker = L.marker([business.latitud, business.longitud], { icon: businessIcon });
      marker.bindPopup(`
        <div style="min-width:200px;">
          <strong>${business.nom_estab}</strong><br/>
          <span style="color:#666;font-size:12px;">${business.nombre_act}</span><br/>
          <span style="font-size:12px;"><strong>Municipio:</strong> ${business.municipio}</span><br/>
          <span style="font-size:12px;"><strong>Localidad:</strong> ${business.localidad}</span><br/>
          <span style="font-size:12px;"><strong>Personal:</strong> ${business.per_ocu}</span>
          ${business.telefono ? `<br/><span style="font-size:12px;"><strong>Tel:</strong> ${business.telefono}</span>` : ''}
        </div>
      `);
      return marker;
    });

    clusterGroupRef.current.addLayers(markers);

    if (toShow.length > 0) {
      const bounds = L.latLngBounds(toShow.map((b) => [b.latitud, b.longitud] as [number, number]));
      mapRef.current.fitBounds(bounds.pad(0.1));
    }
  }, [businesses, searchTerm, selectedMunicipio, selectedActividad, hasFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-gray-600">Cargando negocios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMunicipio}
            onChange={(e) => setSelectedMunicipio(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white min-w-[180px]"
          >
            <option value="">Todos los municipios</option>
            {municipios.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedActividad}
            onChange={(e) => setSelectedActividad(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white min-w-[200px]"
          >
            <option value="">Todas las actividades</option>
            {actividades.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
          />

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedMunicipio('');
                setSelectedActividad('');
                setSearchTerm('');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {hasFilters
              ? `${displayCount.toLocaleString()} negocios encontrados${displayCount > MAX_MARKERS ? ` (mostrando ${MAX_MARKERS.toLocaleString()})` : ''}`
              : `${businesses.length.toLocaleString()} negocios totales - Selecciona un filtro para ver en el mapa`}
          </span>
          <span className="text-xs text-gray-500">
            Estado de Veracruz | Fuente: DENUE INEGI | Periodo: 05/2025
          </span>
        </div>
      </div>
      <div ref={mapContainerRef} className="flex-1" />
    </div>
  );
}
