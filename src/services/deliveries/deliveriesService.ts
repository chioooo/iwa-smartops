import { DEMO_BRANCH_CENTER, DEMO_DELIVERY_STOPS, DELIVERY_STATUS_COLORS } from './deliveries.data';
import type { DeliveryStop, DeliveryStatus } from './deliveries.types';

class DeliveriesService {
  getBranchCenter(): [number, number] {
    return DEMO_BRANCH_CENTER;
  }

  getDeliveryStops(): DeliveryStop[] {
    return DEMO_DELIVERY_STOPS;
  }

  getStatusColors(): Record<DeliveryStatus, string> {
    return DELIVERY_STATUS_COLORS;
  }
}

export const deliveriesService = new DeliveriesService();
