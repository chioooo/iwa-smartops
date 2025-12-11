import { useState, useEffect } from 'react';
import { Package, Layers, Grid3x3, TrendingDown } from 'lucide-react';
import { InventoryDashboard } from './InventoryDashboard';
import { ProductTable } from './ProductTable';
import { SuppliesTable } from './SuppliesTable';
import { CategoriesSection } from './CategoriesSection';
import { ProductModal } from './ProductModal';
import { InventoryAdjustmentModal } from './InventoryAdjustmentModal';
import { ProductDetailPanel } from './ProductDetailPanel';
import { SupplyModal } from './SupplyModal';

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

export type Supply = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  category: string;
  supplier: string;
  status: 'active' | 'inactive';
};

export type Category = {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  color: string;
};

export type InventoryMovement = {
  id: string;
  productId: string;
  type: 'entry' | 'exit' | 'adjustment' | 'transfer';
  quantity: number;
  date: string;
  reason: string;
  user: string;
};

// Claves para localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'inventory_products',
  SUPPLIES: 'inventory_supplies',
  CATEGORIES: 'inventory_categories',
  MOVEMENTS: 'inventory_movements',
};

// Datos iniciales por defecto
const DEFAULT_PRODUCTS: Product[] = [
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

const DEFAULT_SUPPLIES: Supply[] = [
  {
    id: '1',
    name: 'Tóner Negro HP',
    unit: 'pieza',
    stock: 15,
    category: 'Consumibles',
    supplier: 'HP Inc.',
    status: 'active'
  },
  {
    id: '2',
    name: 'Cable HDMI 2m',
    unit: 'pieza',
    stock: 45,
    category: 'Cables',
    supplier: 'Tech Supplies',
    status: 'active'
  },
  {
    id: '3',
    name: 'Clip Metálico',
    unit: 'caja',
    stock: 5,
    category: 'Papelería',
    supplier: 'Papelería Moderna',
    status: 'active'
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Tecnología', description: 'Equipos electrónicos y tecnológicos', productsCount: 3, color: '#D0323A' },
  { id: '2', name: 'Mobiliario', description: 'Muebles y equipamiento de oficina', productsCount: 1, color: '#F6A016' },
  { id: '3', name: 'Papelería', description: 'Artículos de oficina y papelería', productsCount: 1, color: '#E9540D' },
  { id: '4', name: 'Consumibles', description: 'Insumos y materiales consumibles', productsCount: 0, color: '#9F2743' },
];

const DEFAULT_MOVEMENTS: InventoryMovement[] = [
  {
    id: '1',
    productId: '1',
    type: 'entry',
    quantity: 10,
    date: '2024-11-20',
    reason: 'Compra nueva',
    user: 'Juan Pérez'
  },
  {
    id: '2',
    productId: '1',
    type: 'exit',
    quantity: 5,
    date: '2024-11-22',
    reason: 'Venta',
    user: 'María González'
  },
  {
    id: '3',
    productId: '2',
    type: 'adjustment',
    quantity: -2,
    date: '2024-11-23',
    reason: 'Producto dañado',
    user: 'Carlos Ruiz'
  },
];

// Funciones de utilidad para localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<'products' | 'supplies' | 'categories' | 'dashboard'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);

  // Estado inicializado desde localStorage
  const [products, setProducts] = useState<Product[]>(() => 
    loadFromStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS)
  );

  const [supplies, setSupplies] = useState<Supply[]>(() => 
    loadFromStorage(STORAGE_KEYS.SUPPLIES, DEFAULT_SUPPLIES)
  );

  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
  );

  const [movements, setMovements] = useState<InventoryMovement[]>(() => 
    loadFromStorage(STORAGE_KEYS.MOVEMENTS, DEFAULT_MOVEMENTS)
  );

  // Sincronizar productos con localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  // Sincronizar insumos con localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SUPPLIES, supplies);
  }, [supplies]);

  // Sincronizar categorías con localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  // Sincronizar movimientos con localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MOVEMENTS, movements);
  }, [movements]);

  const handleCreateProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: String(products.length + 1),
      image: productData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };
    setProducts([...products, newProduct]);
    setShowProductModal(false);
  };

  const handleUpdateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === productId ? { ...p, ...updates } : p));
    if (selectedProduct?.id === productId) {
      setSelectedProduct({ ...selectedProduct, ...updates });
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleCreateSupply = (supplyData: Omit<Supply, 'id'>) => {
    const newSupply: Supply = {
      ...supplyData,
      id: String(supplies.length + 1)
    };
    setSupplies([...supplies, newSupply]);
    setShowSupplyModal(false);
  };

  const handleUpdateSupply = (supplyId: string, updates: Partial<Supply>) => {
    setSupplies(prevSupplies => prevSupplies.map(s => s.id === supplyId ? { ...s, ...updates } : s));
    setShowSupplyModal(false);
    setEditingSupply(null);
  };

  const handleEditSupply = (supply: Supply) => {
    setEditingSupply(supply);
    setShowSupplyModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    // Limpiar selección si el producto eliminado estaba seleccionado
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleDeleteSupply = (supplyId: string) => {
    setSupplies(prevSupplies => prevSupplies.filter(s => s.id !== supplyId));
  };

  const handleInventoryAdjustment = (productId: string, physicalStock: number, reason: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const difference = physicalStock - product.stock;
      
      // Actualizar stock del producto directamente
      setProducts(prevProducts => prevProducts.map(p => p.id === productId ? { ...p, stock: physicalStock } : p));
      
      // Registrar movimiento
      const newMovement: InventoryMovement = {
        id: String(movements.length + 1),
        productId,
        type: 'adjustment',
        quantity: difference,
        date: new Date().toISOString().split('T')[0],
        reason,
        user: 'Juan Pérez'
      };
      setMovements([...movements, newMovement]);
    }
    // Cerrar modal y limpiar selección
    setShowAdjustmentModal(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleOpenAdjustment = (product: Product) => {
    setSelectedProduct(product);
    setShowAdjustmentModal(true);
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 mb-2">Gestión de Inventario</h1>
              <p className="text-gray-600">Administra productos, insumos y control de stock</p>
            </div>
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
              >
                <Package className="w-5 h-5" />
                Nuevo Producto
              </button>
            )}
            {activeTab === 'supplies' && (
              <button
                onClick={() => {
                  setEditingSupply(null);
                  setShowSupplyModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
              >
                <Layers className="w-5 h-5" />
                Nuevo Insumo
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              Productos
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {products.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('supplies')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'supplies'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-5 h-5" />
              Insumos
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {supplies.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              Categorías
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {categories.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              Vista General
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <InventoryDashboard
            products={products}
            supplies={supplies}
            categories={categories}
            lowStockCount={lowStockCount}
            onViewProducts={() => setActiveTab('products')}
          />
        )}

        {activeTab === 'products' && (
          <ProductTable
            products={products}
            categories={categories}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleEditProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onOpenAdjustment={handleOpenAdjustment}
            selectedProductId={selectedProduct?.id}
          />
        )}

        {activeTab === 'supplies' && (
          <SuppliesTable
            supplies={supplies}
            onCreateSupply={handleCreateSupply}
            onEditSupply={handleEditSupply}
            onDeleteSupply={handleDeleteSupply}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesSection
            categories={categories}
            products={products}
            onUpdateCategories={setCategories}
          />
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && !showAdjustmentModal && (
        <ProductDetailPanel
          product={selectedProduct}
          movements={movements.filter(m => m.productId === selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => handleEditProduct(selectedProduct)}
        />
      )}

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          categories={categories}
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onCreate={handleCreateProduct}
          onUpdate={handleUpdateProduct}
        />
      )}

      {/* Inventory Adjustment Modal */}
      {showAdjustmentModal && selectedProduct && (
        <InventoryAdjustmentModal
          product={selectedProduct}
          onClose={() => {
            setShowAdjustmentModal(false);
            setSelectedProduct(null);
          }}
          onAdjust={handleInventoryAdjustment}
        />
      )}

      {/* Supply Modal */}
      {showSupplyModal && (
        <SupplyModal
          supply={editingSupply}
          categories={categories}
          onClose={() => {
            setShowSupplyModal(false);
            setEditingSupply(null);
          }}
          onCreate={handleCreateSupply}
          onUpdate={handleUpdateSupply}
        />
      )}
    </div>
  );
}