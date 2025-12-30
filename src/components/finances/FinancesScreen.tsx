import { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  PieChart, 
  FileText
} from 'lucide-react';
import { FinancesDashboard } from './FinancesDashboard';
import { InventoryValuation } from './InventoryValuation';
import { ProfitAnalysis } from './ProfitAnalysis';
import { FinancialReports } from './FinancialReports';

// Tipos de datos de inventario (compartidos)
export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  purchasePrice: number;
  unit: string;
  supplier: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  warehouse?: string;
};

export type FinancialSummary = {
  totalInventoryValue: number;
  totalInventoryCost: number;
  potentialProfit: number;
  profitMargin: number;
  lowStockValue: number;
  categoryBreakdown: CategoryFinance[];
};

export type CategoryFinance = {
  category: string;
  totalValue: number;
  totalCost: number;
  profit: number;
  margin: number;
  itemCount: number;
};

export function FinancesScreen() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'valuation' | 'profit' | 'reports'>('dashboard');

  // Mock data - productos (mismos datos que inventario)
  const products: Product[] = [
    {
      id: '1',
      name: 'Laptop Dell XPS 15',
      sku: 'TECH-001',
      category: 'Tecnología',
      stock: 15,
      minStock: 5,
      price: 1299.99,
      purchasePrice: 999.99,
      unit: 'pieza',
      supplier: 'Dell Inc.',
      description: 'Laptop de alto rendimiento',
      status: 'active',
      image: 'LP',
      warehouse: 'Almacén Principal'
    },
    {
      id: '2',
      name: 'Silla Ergonómica Pro',
      sku: 'FURN-002',
      category: 'Mobiliario',
      stock: 3,
      minStock: 10,
      price: 299.99,
      purchasePrice: 199.99,
      unit: 'pieza',
      supplier: 'Office Supplies Co.',
      description: 'Silla ergonómica con soporte lumbar',
      status: 'active',
      image: 'SE',
      warehouse: 'Almacén Principal'
    },
    {
      id: '3',
      name: 'Papel Carta 500 hojas',
      sku: 'OFF-003',
      category: 'Papelería',
      stock: 120,
      minStock: 20,
      price: 5.99,
      purchasePrice: 3.99,
      unit: 'paquete',
      supplier: 'Papelería Moderna',
      description: 'Papel carta tamaño estándar',
      status: 'active',
      image: 'PC',
      warehouse: 'Almacén Secundario'
    },
    {
      id: '4',
      name: 'Monitor LG 27" 4K',
      sku: 'TECH-004',
      category: 'Tecnología',
      stock: 8,
      minStock: 5,
      price: 399.99,
      purchasePrice: 299.99,
      unit: 'pieza',
      supplier: 'LG Electronics',
      description: 'Monitor 4K con HDR',
      status: 'active',
      image: 'ML',
      warehouse: 'Almacén Principal'
    },
    {
      id: '5',
      name: 'Impresora HP LaserJet',
      sku: 'TECH-005',
      category: 'Tecnología',
      stock: 2,
      minStock: 3,
      price: 249.99,
      purchasePrice: 179.99,
      unit: 'pieza',
      supplier: 'HP Inc.',
      description: 'Impresora láser monocromática',
      status: 'inactive',
      image: 'IH',
      warehouse: 'Almacén Principal'
    },
  ];

  // Calcular métricas financieras
  const calculateFinancialSummary = (): FinancialSummary => {
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalInventoryCost = products.reduce((sum, p) => sum + (p.purchasePrice * p.stock), 0);
    const potentialProfit = totalInventoryValue - totalInventoryCost;
    const profitMargin = totalInventoryCost > 0 ? (potentialProfit / totalInventoryCost) * 100 : 0;
    
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const lowStockValue = lowStockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Agrupar por categoría
    const categoryMap = new Map<string, CategoryFinance>();
    products.forEach(p => {
      const existing = categoryMap.get(p.category);
      const value = p.price * p.stock;
      const cost = p.purchasePrice * p.stock;
      
      if (existing) {
        existing.totalValue += value;
        existing.totalCost += cost;
        existing.profit += value - cost;
        existing.itemCount += 1;
      } else {
        categoryMap.set(p.category, {
          category: p.category,
          totalValue: value,
          totalCost: cost,
          profit: value - cost,
          margin: 0,
          itemCount: 1
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      margin: cat.totalCost > 0 ? (cat.profit / cat.totalCost) * 100 : 0
    }));

    return {
      totalInventoryValue,
      totalInventoryCost,
      potentialProfit,
      profitMargin,
      lowStockValue,
      categoryBreakdown
    };
  };

  const financialSummary = calculateFinancialSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold mb-2">Finanzas e Inventario</h1>
              <p className="text-gray-600">Análisis financiero basado en datos de inventario</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart className="w-5 h-5" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('valuation')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'valuation'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              Valoración
            </button>
            <button
              onClick={() => setActiveTab('profit')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'profit'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Rentabilidad
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Reportes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <FinancesDashboard 
            products={products} 
            summary={financialSummary} 
          />
        )}

        {activeTab === 'valuation' && (
          <InventoryValuation 
            products={products} 
            summary={financialSummary} 
          />
        )}

        {activeTab === 'profit' && (
          <ProfitAnalysis 
            products={products} 
            summary={financialSummary} 
          />
        )}

        {activeTab === 'reports' && (
          <FinancialReports 
            products={products} 
            summary={financialSummary} 
          />
        )}
      </div>
    </div>
  );
}
