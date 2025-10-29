# Dataverse Connection - Quick Reference

## 🚀 Quick Start

### Import and Use Service

```typescript
import { Cr8acCodeappstableService } from './generated/services/Cr8acCodeappstableService';
import type { ICr8acCodeappsTableCreateRequest } from './generated/models/Cr8acCodeappstableModel';
import { PowerAppsGuard } from './components/PowerAppsGuard';

export function MyComponent() {
  return (
    <PowerAppsGuard>
      <DataDisplay />
    </PowerAppsGuard>
  );
}

async function DataDisplay() {
  // CRUD Operations
  
  // CREATE
  const result = await Cr8acCodeappstableService.create({
    cr8ac_name: 'New Record',
    cr8ac_value: 100
  });
  
  // READ (single)
  const record = await Cr8acCodeappstableService.get(recordId);
  
  // READ (multiple)
  const records = await Cr8acCodeappstableService.getAll({
    select: ['cr8ac_name', 'cr8ac_value'],
    filter: "cr8ac_value gt 50",
    orderBy: ['cr8ac_name asc'],
    top: 50
  });
  
  // UPDATE
  await Cr8acCodeappstableService.update(recordId, {
    cr8ac_name: 'Updated'
  });
  
  // DELETE
  await Cr8acCodeappstableService.delete(recordId);
}
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `Cr8acCodeappstableService.ts` | CRUD operations |
| `Cr8acCodeappstableModel.ts` | Data types |
| `PowerAppsGuard.tsx` | Initialization protection |
| `usePowerAppsInit.ts` | SDK initialization hook |
| `DataverseExample.tsx` | Example component |

## 🔍 Query Options

```typescript
interface IGetAllOptions {
  select?: string[];        // ['name', 'value']
  filter?: string;          // "value gt 50"
  orderBy?: string[];       // ['name asc', 'value desc']
  top?: number;            // 50
  skip?: number;           // 0
  skipToken?: string;      // pagination token
  maxPageSize?: number;    // records per page
}
```

## ✅ Always Remember

1. **Wrap with PowerAppsGuard** - Ensures SDK is initialized
2. **Check for errors** - All results have optional `error` property
3. **Limit select fields** - Only retrieve what you need
4. **Use filters** - Reduces data transfer
5. **Handle async** - All operations are async

## 📚 Full Documentation

- Detailed Guide: `DATAVERSE_GUIDE.md`
- Setup Info: `DATAVERSE_SETUP.md`
- Working Example: `src/components/DataverseExample.tsx`

## 🐛 Debugging

All service operations log to console with prefix:
```
[Cr8acCodeappstableService] Creating record...
[Cr8acCodeappstableService] Record created successfully
```

Check browser console (F12) for detailed logs.

## 🎯 Supported Table

- **Logical Name**: `cr8ac_codeappstable`
- **Primary Key**: `cr8ac_codeappstableid`
- **Connection**: Dataverse (Power Apps Code)

---

**App Running At**: http://localhost:3000/
**Build Status**: ✅ Passing
**Type Safety**: ✅ Full TypeScript
