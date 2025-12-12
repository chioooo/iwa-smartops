import { useState } from 'react';
import { deliveriesService } from '../../services/deliveries/deliveriesService';
import { DeliveriesTab } from './DeliveriesTab';
import { BranchesTab } from './BranchesTab';

export function DeliveriesScreen() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'branches'>('deliveries');
  const center = deliveriesService.getBranchCenter();
  const deliveryStops = deliveriesService.getDeliveryStops();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-gray-900 text-2xl font-semibold mb-2">Entregas</h1>
          <p className="text-gray-600">Mapa de entregas (Leaflet)</p>

          <div className="mt-6 flex gap-1 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('deliveries')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'deliveries'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Entregas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'branches'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Sucursales
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {activeTab === 'deliveries' ? (
            <DeliveriesTab key="deliveries" stops={deliveryStops} />
          ) : (
            <BranchesTab key="branches" center={center} popupText="Entregas: Sucursal principal" />
          )}
        </div>
      </div>
    </div>
  );
}
