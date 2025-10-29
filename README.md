# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# 🎉 NanoWorld - Power Apps Code App with Dataverse Integration

> A **production-ready** Power Apps Code App with complete Dataverse connectivity, type-safe CRUD operations, and comprehensive documentation.

## ✨ What's Included

- ✅ **Full Dataverse Integration** - Create, Read, Update, Delete operations
- ✅ **Type-Safe Service** - Complete TypeScript implementation
- ✅ **SDK Protection** - Automatic initialization guards and safety checks
- ✅ **Advanced Querying** - Filtering, sorting, pagination support
- ✅ **Comprehensive Docs** - 9 detailed guides and examples
- ✅ **Production Ready** - All tests passing, fully typed, error handled

## 🚀 Quick Start

### 1. Import Service
```typescript
import { Cr8acCodeappstableService } from './generated/services/Cr8acCodeappstableService';
import { PowerAppsGuard } from './components/PowerAppsGuard';
```

### 2. Wrap Component
```tsx
<PowerAppsGuard>
  <YourComponent />
</PowerAppsGuard>
```

### 3. Use Service
```typescript
// CREATE
await Cr8acCodeappstableService.create({ cr8ac_name: 'Test', cr8ac_value: 100 });

// READ
const records = await Cr8acCodeappstableService.getAll({ top: 50 });

// UPDATE
await Cr8acCodeappstableService.update(id, { cr8ac_name: 'Updated' });

// DELETE
await Cr8acCodeappstableService.delete(id);
```

## 📚 Documentation

Start with one of these:

| Guide | Time | Best For |
|-------|------|----------|
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | 5 min | Getting started fast |
| **[EXAMPLES_AND_PATTERNS.md](EXAMPLES_AND_PATTERNS.md)** | 15 min | Learning by example |
| **[INDEX.md](INDEX.md)** | 2 min | Finding what you need |
| **[DATAVERSE_GUIDE.md](DATAVERSE_GUIDE.md)** | 30 min | Complete API reference |
| **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** | 10 min | Understanding the setup |

## 💻 Core Capabilities

### CRUD Operations
```typescript
// Create
await Cr8acCodeappstableService.create({ cr8ac_name: 'Test', cr8ac_value: 100 });

// Read
const records = await Cr8acCodeappstableService.getAll({ top: 50 });

// Update
await Cr8acCodeappstableService.update(recordId, { cr8ac_name: 'Updated' });

// Delete
await Cr8acCodeappstableService.delete(recordId);
```

### Advanced Queries
```typescript
const records = await Cr8acCodeappstableService.getAll({
  select: ['cr8ac_name', 'cr8ac_value'],
  filter: "cr8ac_value gt 50",
  orderBy: ['cr8ac_name asc'],
  top: 50
});
```

## 🔒 Safety First

All operations are protected:
- ✅ Automatic SDK initialization
- ✅ Loading states during init
- ✅ Error handling and reporting
- ✅ Type-safe operations

## 🛠️ Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Lint code
npm run preview  # Preview build
```

## ✅ Features

- ✅ Full CRUD operations
- ✅ Type-safe TypeScript
- ✅ OData filtering and sorting
- ✅ Pagination support
- ✅ Error handling
- ✅ SDK initialization safety
- ✅ Comprehensive logging
- ✅ Working examples
- ✅ Production ready

## 📞 Quick Links

- **Quick Start**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Examples**: [EXAMPLES_AND_PATTERNS.md](EXAMPLES_AND_PATTERNS.md)
- **Full Guide**: [DATAVERSE_GUIDE.md](DATAVERSE_GUIDE.md)
- **Documentation Index**: [INDEX.md](INDEX.md)
- **All Files**: [FILES_CREATED.md](FILES_CREATED.md)

## 🚀 Ready to Build!

Your code app is **production-ready** with complete Dataverse integration.

**Start with**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) or [INDEX.md](INDEX.md)

---

**Status**: 🟢 Production Ready | **Build**: ✅ Passing | **Docs**: ✅ Complete

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
