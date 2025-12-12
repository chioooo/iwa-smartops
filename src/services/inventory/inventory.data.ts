import type { Category, InventoryMovement, Product, Supply } from './inventory.types';

export const DEMO_PRODUCTS: Product[] = [
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

export const DEMO_SUPPLIES: Supply[] = [
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

export const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Tecnología', description: 'Equipos electrónicos y tecnológicos', productsCount: 3, color: '#D0323A' },
  { id: '2', name: 'Mobiliario', description: 'Muebles y equipamiento de oficina', productsCount: 1, color: '#F6A016' },
  { id: '3', name: 'Papelería', description: 'Artículos de oficina y papelería', productsCount: 1, color: '#E9540D' },
  { id: '4', name: 'Consumibles', description: 'Insumos y materiales consumibles', productsCount: 0, color: '#9F2743' },
];

export const DEMO_MOVEMENTS: InventoryMovement[] = [
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
