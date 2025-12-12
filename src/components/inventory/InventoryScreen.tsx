import { useState, useEffect } from 'react';
import { Package, Layers, Grid3x3, TrendingDown, X, Star, FileDown, Mail } from 'lucide-react';
import jsPDF from 'jspdf';
import { InventoryDashboard } from './InventoryDashboard';
import { ProductTable } from './ProductTable';
import { SuppliesTable } from './SuppliesTable';
import { CategoriesSection } from './CategoriesSection';
import { ProductModal } from './ProductModal';
import { InventoryAdjustmentModal } from './InventoryAdjustmentModal';
import { ProductDetailPanel } from './ProductDetailPanel';
import {
  buildInventoryAIResponse,
  type InventoryAIOption,
  type InventoryAIResponse,
} from './InventoryResponsesIA';
import { SupplyModal } from './SupplyModal';
import { ConfirmModal } from '../common/ConfirmModal';

import { inventoryService } from '../../services/inventory/inventoryService';
import type { Category, InventoryMovement, Product, Supply } from '../../services/inventory/inventory.types';

export function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<'products' | 'supplies' | 'categories' | 'dashboard'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showAnalysisDetailModal, setShowAnalysisDetailModal] = useState(false);
  const [analysisDetail, setAnalysisDetail] = useState<InventoryAIResponse | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [typedIntro, setTypedIntro] = useState('');
  const [visibleBulletCount, setVisibleBulletCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<
    | {
        kind: 'product' | 'supply';
        id: string;
        name: string;
      }
    | null
  >(null);

  useEffect(() => {
    if (!analysisDetail || !showAnalysisDetailModal) {
      return;
    }
    let introIndex = 0;
    const introText = analysisDetail.intro;
    const bullets = analysisDetail.bullets;

    let introInterval: number | undefined;
    let bulletTimeout: number | undefined;

    const startBullets = () => {
      let bulletIndex = 0;

      const showNextBullet = () => {
        bulletIndex += 1;
        setVisibleBulletCount(bulletIndex);

        if (bulletIndex < bullets.length) {
          bulletTimeout = window.setTimeout(showNextBullet, 400);
        } else {
          setIsTypingComplete(true);
        }
      };

      if (bullets.length > 0) {
        bulletTimeout = window.setTimeout(showNextBullet, 400);
      } else {
        setIsTypingComplete(true);
      }
    };

    introInterval = window.setInterval(() => {
      if (introIndex < introText.length) {
        introIndex += 1;
        setTypedIntro(introText.slice(0, introIndex));
        return;
      }

      if (introInterval !== undefined) {
        window.clearInterval(introInterval);
        introInterval = undefined;
      }

      startBullets();
    }, 20);

    return () => {
      if (introInterval !== undefined) {
        window.clearInterval(introInterval);
      }
      if (bulletTimeout !== undefined) {
        window.clearTimeout(bulletTimeout);
      }
    };
  }, [analysisDetail, showAnalysisDetailModal]);

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

  const handleAnalysisOption = (option: InventoryAIOption) => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock <= p.minStock).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    const response = buildInventoryAIResponse(option, {
      totalProducts,
      totalStock,
      lowStock,
    });

    setAnalysisDetail(response);
    setTypedIntro('');
    setVisibleBulletCount(0);
    setIsTypingComplete(false);
    setShowAnalysisModal(false);
    setShowAnalysisDetailModal(true);
  };

  const getReportDate = () => {
    return new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExportPDF = () => {
    if (!analysisDetail) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 0;

    // Header con fondo de color
    doc.setFillColor(208, 50, 58);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Título del sistema
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('SmartOps', margin, 20);

    // Subtítulo
    doc.setFontSize(11);
    doc.setTextColor(255, 220, 220);
    doc.text('Sistema de Gestión Inteligente de Inventario', margin, 30);

    // Badge de IA
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Generado por IA', pageWidth - margin - 35, 20);

    // Fecha en header
    doc.setFontSize(8);
    doc.setTextColor(255, 220, 220);
    doc.text(getReportDate(), pageWidth - margin - 45, 30);

    yPosition = 60;

    // Título del análisis
    doc.setFontSize(18);
    doc.setTextColor(208, 50, 58);
    doc.text(analysisDetail.title, margin, yPosition);
    yPosition += 12;

    // Línea decorativa
    doc.setDrawColor(208, 50, 58);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, margin + 60, yPosition);
    yPosition += 15;

    // Contenido del intro - procesar por secciones
    const introText = analysisDetail.intro;
    const sections = introText.split('\n\n');

    sections.forEach((section) => {
      const lines = section.split('\n');
      lines.forEach((line) => {
        // Detectar si es un encabezado de sección (tiene emoji al inicio)
        const sectionEmojis = ['📊', '⚠️', '⭐', '📉', '🔄', '🧠', '📋', '💡', '🎯', '🚀'];
        const isHeader = sectionEmojis.some(emoji => line.startsWith(emoji));
        
        if (isHeader) {
          yPosition += 5;
          doc.setFontSize(12);
          doc.setTextColor(208, 50, 58);
          doc.text(line, margin, yPosition);
          yPosition += 8;
        } else if (line.startsWith('•')) {
          // Es un bullet del intro
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          const bulletLines = doc.splitTextToSize(line, maxWidth - 10);
          if (yPosition + bulletLines.length * 5 > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(bulletLines, margin + 5, yPosition);
          yPosition += bulletLines.length * 5 + 2;
        } else if (line.trim()) {
          // Texto normal
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const textLines = doc.splitTextToSize(line, maxWidth);
          if (yPosition + textLines.length * 5 > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(textLines, margin, yPosition);
          yPosition += textLines.length * 5 + 2;
        }
      });
      yPosition += 5;
    });

    // Sección de recomendaciones
    yPosition += 10;
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Caja de recomendaciones
    const recBoxY = yPosition;
    doc.setFillColor(250, 245, 245);
    doc.setDrawColor(208, 50, 58);
    doc.setLineWidth(0.3);
    
    // Calcular altura de la caja
    let tempY = 0;
    analysisDetail.bullets.forEach((bullet) => {
      const bulletLines = doc.splitTextToSize(`→ ${bullet}`, maxWidth - 20);
      tempY += bulletLines.length * 5 + 6;
    });
    const boxHeight = tempY + 25;

    if (recBoxY + boxHeight > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }

    doc.roundedRect(margin, yPosition, maxWidth, boxHeight, 3, 3, 'FD');

    yPosition += 12;
    doc.setFontSize(12);
    doc.setTextColor(208, 50, 58);
    doc.text('Recomendaciones', margin + 10, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    analysisDetail.bullets.forEach((bullet, index) => {
      const bulletLines = doc.splitTextToSize(`${index + 1}. ${bullet}`, maxWidth - 25);
      doc.text(bulletLines, margin + 10, yPosition);
      yPosition += bulletLines.length * 5 + 6;
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Este reporte fue generado automáticamente por el asistente de IA de SmartOps.', margin, footerY);
    doc.text('Los datos reflejan el estado del inventario al momento de la consulta.', margin, footerY + 4);

    // Número de página
    doc.text(`Página 1`, pageWidth - margin - 15, footerY);

    doc.save(`analisis-inventario-${Date.now()}.pdf`);
  };

  const generateEmailHTML = (): string => {
    if (!analysisDetail) return '';

    const fecha = getReportDate();
    
    // Procesar el intro para convertir emojis y bullets en HTML
    const formatIntro = (text: string) => {
      return text
        .split('\n')
        .map(line => {
          const headerEmojis = ['📊', '⚠️', '⭐', '📉', '🔄', '🧠', '📋', '💡', '🎯', '🚀'];
          if (headerEmojis.some(emoji => line.startsWith(emoji))) {
            return `<h3 style="color: #D0323A; font-size: 14px; margin: 16px 0 8px 0; font-weight: 600;">${line}</h3>`;
          } else if (line.startsWith('•')) {
            return `<p style="color: #444; font-size: 13px; margin: 4px 0 4px 16px;">${line}</p>`;
          } else if (line.trim()) {
            return `<p style="color: #333; font-size: 13px; margin: 4px 0; line-height: 1.5;">${line}</p>`;
          }
          return '';
        })
        .join('');
    };

    const bulletsHTML = analysisDetail.bullets
      .map((bullet, i) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #D0323A; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px;">${i + 1}</span>
            <span style="color: #444; font-size: 13px;">${bullet}</span>
          </td>
        </tr>
      `)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #D0323A 0%, #9F2743 100%); padding: 30px 40px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">SmartOps</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 13px;">Sistema de Gestión Inteligente de Inventario</p>
                  </td>
                </tr>
                
                <!-- Badge IA -->
                <tr>
                  <td style="padding: 20px 40px 0 40px;">
                    <span style="display: inline-block; background: #FEF2F2; color: #D0323A; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 500;">
                      ✨ Generado por IA • ${fecha}
                    </span>
                  </td>
                </tr>

                <!-- Título -->
                <tr>
                  <td style="padding: 20px 40px 10px 40px;">
                    <h2 style="color: #1a1a1a; margin: 0; font-size: 20px; font-weight: 600;">${analysisDetail.title}</h2>
                    <div style="width: 60px; height: 3px; background: #D0323A; margin-top: 12px; border-radius: 2px;"></div>
                  </td>
                </tr>

                <!-- Contenido del análisis -->
                <tr>
                  <td style="padding: 10px 40px 20px 40px;">
                    ${formatIntro(analysisDetail.intro)}
                  </td>
                </tr>

                <!-- Recomendaciones -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <div style="background: #FAFAFA; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
                      <div style="background: #D0323A; padding: 12px 16px;">
                        <h3 style="color: #ffffff; margin: 0; font-size: 14px; font-weight: 600;">📋 Recomendaciones</h3>
                      </div>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${bulletsHTML}
                      </table>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9f9f9; padding: 20px 40px; border-top: 1px solid #e5e5e5;">
                    <p style="color: #888; font-size: 11px; margin: 0; line-height: 1.6;">
                      Este reporte fue generado automáticamente por el asistente de IA de SmartOps.<br>
                      Los datos reflejan el estado del inventario al momento de la consulta.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Pie de email -->
              <p style="color: #999; font-size: 11px; margin-top: 20px;">
                &copy; ${new Date().getFullYear()} SmartOps - Todos los derechos reservados
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const requestDeleteProduct = (product: Product) => {
    setConfirmDelete({ kind: 'product', id: product.id, name: product.name });
  };

  const requestDeleteSupply = (supply: Supply) => {
    setConfirmDelete({ kind: 'supply', id: supply.id, name: supply.name });
  };

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
            <div className="flex items-center gap-8">
              {activeTab === 'products' && (
                <button
                  onClick={() => {
                    setShowAnalysisModal(true);
                  }}
                  className="flex items-right gap-2 px-4 py-2.5 ia-gradient-animated text-white rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  Analisis IA
                </button>
              )}
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
            onDeleteProduct={requestDeleteProduct}
            onOpenAdjustment={handleOpenAdjustment}
            selectedProductId={selectedProduct?.id}
          />
        )}

        {activeTab === 'supplies' && (
          <SuppliesTable
            supplies={supplies}
            onCreateSupply={handleCreateSupply}
            onEditSupply={handleEditSupply}
            onDeleteSupply={requestDeleteSupply}
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

      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-2xl">
              <div>
                <h2 className="text-gray-900">Analisis de inventario</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Selecciona el tipo de análisis que deseas realizar
                </p>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div
                  className="px-4 py-3 rounded-lg border border-gray-200 hover:border-[#D0323A] hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => handleAnalysisOption('inventory')}
                >
                  <p className="text-gray-900">Analisis de inventario</p>
                </div>
                <div
                  className="px-4 py-3 rounded-lg border border-gray-200 hover:border-[#D0323A] hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => handleAnalysisOption('lowStock')}
                >
                  <p className="text-gray-900">Stock bajo</p>
                </div>
                <div
                  className="px-4 py-3 rounded-lg border border-gray-200 hover:border-[#D0323A] hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => handleAnalysisOption('highMargin')}
                >
                  <p className="text-gray-900">Mayor utilidad</p>
                </div>
                <div
                  className="px-4 py-3 rounded-lg border border-gray-200 hover:border-[#D0323A] hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => handleAnalysisOption('unsold')}
                >
                  <p className="text-gray-900">Productos no vendidos</p>
                </div>
                <div
                  className="px-4 py-3 rounded-lg border border-gray-200 hover:border-[#D0323A] hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() => handleAnalysisOption('noMovement')}
                >
                  <p className="text-gray-900">Estrategias de venta a productos sin movimiento</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAnalysisDetailModal && analysisDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-2xl">
              <div>
                <p className="text-xs font-medium text-[#D0323A] mb-1">Respuesta generada por IA</p>
                <h2 className="text-gray-900">{analysisDetail.title}</h2>
              </div>
              <button
                onClick={() => setShowAnalysisDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pt-4 pb-6 space-y-4">
              {!isTypingComplete && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span>IA analizando tu inventario...</span>
                </div>
              )}

              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{typedIntro}</p>

              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                {analysisDetail.bullets.slice(0, visibleBulletCount).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {isTypingComplete && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">✅ Análisis completado. ¿Deseas exportar este reporte?</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors text-sm"
                    >
                      <FileDown className="w-4 h-4" />
                      Exportar PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailAddress('');
                        setEmailSent(false);
                        setShowEmailModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-[#D0323A] text-[#D0323A] rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      Enviar por correo
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAnalysisDetailModal(false);
                    setShowAnalysisModal(true);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Ver otras opciones
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnalysisDetailModal(false)}
                  className="px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-2xl">
              <div>
                <h2 className="text-gray-900">Enviar análisis por correo</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Ingresa el correo electrónico del destinatario
                </p>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {emailSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">¡Correo enviado!</p>
                  <p className="text-gray-600 text-sm">
                    El análisis ha sido enviado a {emailAddress}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="mt-4 px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!emailAddress.trim() || !analysisDetail) return;
                    setEmailSending(true);

                    try {
                      const htmlContent = generateEmailHTML();
                      const response = await fetch('http://localhost:3001/api/send-email', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          to: emailAddress,
                          subject: `SmartOps - ${analysisDetail.title}`,
                          body: htmlContent,
                          provider: 'microsoft'
                        }),
                      });

                      const result = await response.json();

                      if (result.success) {
                        setEmailSent(true);
                      } else {
                        alert(`Error al enviar: ${result.error}`);
                      }
                    } catch (error) {
                      console.error('Error enviando correo:', error);
                      alert('Error de conexión con el servidor de correo');
                    } finally {
                      setEmailSending(false);
                    }
                  }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0323A] focus:border-[#D0323A] outline-none transition-colors"
                    required
                    disabled={emailSending}
                  />
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      disabled={emailSending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={emailSending || !emailAddress.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emailSending ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Enviar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmDelete !== null}
        title="Confirmar eliminación"
        message={
          confirmDelete?.kind === 'product'
            ? `¿Estás seguro de eliminar el producto "${confirmDelete.name}"?`
            : confirmDelete?.kind === 'supply'
              ? `¿Estás seguro de eliminar el insumo "${confirmDelete.name}"?`
              : ''
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.kind === 'product') {
            handleDeleteProduct(confirmDelete.id);
          } else {
            handleDeleteSupply(confirmDelete.id);
          }
          setConfirmDelete(null);
        }}
      />
    </div>
  );
 }