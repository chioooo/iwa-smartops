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

import { inventoryService } from '../../services/inventory/inventoryService';
import type { Category, InventoryMovement, Product, Supply } from '../../services/inventory/inventory.types';

export function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<'products' | 'supplies' | 'categories' | 'dashboard'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);

  const [products, setProducts] = useState<Product[]>(() => inventoryService.getProducts());
  const [supplies, setSupplies] = useState<Supply[]>(() => inventoryService.getSupplies());
  const [categories, setCategories] = useState<Category[]>(() => inventoryService.getCategories());
  const [movements, setMovements] = useState<InventoryMovement[]>(() => inventoryService.getMovements());

  useEffect(() => {
    inventoryService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    inventoryService.saveSupplies(supplies);
  }, [supplies]);

  useEffect(() => {
    inventoryService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    inventoryService.saveMovements(movements);
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
      handleUpdateProduct(productId, { stock: physicalStock });
            
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold mb-2">Gestión de Inventario</h1>
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