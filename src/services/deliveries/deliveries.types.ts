export type DeliveryStatus = 'origin' | 'completed' | 'in_progress' | 'pending';

export type DeliveryStop = {
  id: number;
  position: [number, number];
  customer: string;
  status: DeliveryStatus;
};

export type RouteLeg = {
  id: string;
  coords: [number, number][];
  color: string;
  distanceKm: string;
  durationMin: number;
  destination: string;
};

export type RouteTotals = {
  distanceKm: string;
  durationMin: number;
};
