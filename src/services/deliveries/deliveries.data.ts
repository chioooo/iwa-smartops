import type { DeliveryStatus, DeliveryStop } from './deliveries.types';

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  completed: '#2ecc71',
  in_progress: '#3498db',
  pending: '#ffe925d8',
  origin: '#c209b2d8',
};

export const DEMO_BRANCH_CENTER: [number, number] = [18.858863939667547, -97.09228267339682];

export const DEMO_DELIVERY_STOPS: DeliveryStop[] = [
  { id: 1, position: [18.858863939667547, -97.09228267339682], customer: 'Sucursal principal', status: 'origin' },
  { id: 2, position: [18.8634, -97.0955], customer: 'Cliente 1', status: 'completed' },
  { id: 3, position: [18.8593, -97.1148], customer: 'Cliente 2', status: 'in_progress' },
  { id: 4, position: [18.8466, -97.1111], customer: 'Cliente 3', status: 'pending' },
];
