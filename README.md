# iWA SmartOps — Demo Dashboard
Aplicación de demostración construida con **React + TypeScript + Vite**, usando **TailwindCSS**, **Lucide Icons**, y un sistema de UI modular tipo admin panel.

---

## 🚀 Tecnologías utilizadas

- **React + TypeScript**
- **Vite**
- **TailwindCSS**
- **Lucide-react Icons**

---

## 🏗️ Arquitectura SOLID

El proyecto implementa los principios **SOLID** en la capa de servicios para mejorar la mantenibilidad, testabilidad y extensibilidad del código.

### Estructura de Servicios

```
src/services/
├── core/                           # Infraestructura base
│   ├── interfaces/
│   │   ├── IStorageProvider.ts     # Abstracción de almacenamiento (DIP)
│   │   ├── IRepository.ts          # Repositorio genérico (DIP/ISP)
│   │   └── index.ts
│   ├── storage/
│   │   ├── LocalStorageProvider.ts # Implementación localStorage
│   │   └── index.ts
│   ├── BaseRepository.ts           # Clase base reutilizable (OCP)
│   └── index.ts
│
├── users/                          # Dominio de usuarios
│   ├── interfaces/
│   │   ├── IUserRepository.ts      # Contrato para usuarios (ISP)
│   │   ├── IRoleRepository.ts      # Contrato para roles (ISP)
│   │   └── index.ts
│   ├── UserRepository.ts           # Persistencia de usuarios (SRP)
│   ├── RoleRepository.ts           # Persistencia de roles (SRP)
│   ├── UserService.ts              # Coordinación de operaciones
│   ├── userServiceInstance.ts      # Factory + singleton
│   └── index.ts
│
├── inventory/                      # Dominio de inventario
│   ├── interfaces/
│   │   ├── IProductRepository.ts
│   │   ├── ISupplyRepository.ts
│   │   ├── ICategoryRepository.ts
│   │   ├── IMovementRepository.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── ProductRepository.ts
│   │   ├── SupplyRepository.ts
│   │   ├── CategoryRepository.ts
│   │   ├── MovementRepository.ts
│   │   └── index.ts
│   ├── InventoryServiceNew.ts
│   ├── inventoryServiceInstance.ts
│   └── inventory.types.ts
│
├── settings/                       # Dominio de configuración
│   ├── interfaces/
│   │   ├── ISettingsRepository.ts
│   │   └── index.ts
│   ├── SettingsRepository.ts
│   ├── settingsServiceInstance.ts
│   └── settings.types.ts
│
└── index.ts                        # Exports centralizados
```

### Principios SOLID Aplicados

| Principio | Descripción | Implementación |
|-----------|-------------|----------------|
| **S** - Single Responsibility | Una clase, una responsabilidad | Cada repositorio maneja solo una entidad |
| **O** - Open/Closed | Abierto a extensión, cerrado a modificación | `BaseRepository` extensible; nuevos providers sin cambios |
| **L** - Liskov Substitution | Subtipos sustituibles | Todos los repositorios implementan `IRepository<T>` |
| **I** - Interface Segregation | Interfaces pequeñas y específicas | Interfaces separadas por dominio |
| **D** - Dependency Inversion | Depender de abstracciones | Servicios usan `IStorageProvider`, `IRepository` |

### Beneficios

- **Testabilidad**: Inyección de mocks para `IStorageProvider` en tests
- **Extensibilidad**: Fácil agregar nuevos backends (IndexedDB, API REST, etc.)
- **Mantenibilidad**: Código modular y desacoplado
- **Reutilización**: `BaseRepository` elimina duplicación de código CRUD

### Uso

```typescript
// Nuevo estilo (recomendado)
import { userService, inventoryServiceNew, settingsRepository } from './services';

// Legacy (compatibilidad hacia atrás)
import { demoDataService, inventoryService, settingsService } from './services';
```

---

## 📦 Scripts disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview


# Inicializar el server para correos:
cd server
npm install
npm run dev
