# Dataverse Integration Guide

## Overview
This guide explains how to connect your code app to Microsoft Dataverse and perform CRUD operations using the Power Apps SDK.

## Prerequisites
✅ Power Apps SDK (@microsoft/power-apps) installed
✅ Power Apps CLI (PAC CLI) version 1.46 or later
✅ Environment with Dataverse enabled
✅ Connected to environment via PAC CLI

## Architecture

### Generated Files Structure
```
src/
├── generated/
│   ├── models/
│   │   └── Cr8acCodeappstableModel.ts          # Data model
│   └── services/
│       └── Cr8acCodeappstableService.ts        # CRUD service
├── hooks/
│   └── usePowerAppsInit.ts                     # SDK initialization
├── components/
│   ├── PowerAppsGuard.tsx                      # Protection wrapper
│   └── DataverseExample.tsx                    # Example usage
```

## Step 1: Add Data Source to Your Code App

Use the PAC CLI to add Dataverse as a data source:

```bash
pac code add-data-source -a dataverse -t cr8ac_codeappstable
```

Replace `cr8ac_codeappstable` with your table's logical name.

## Step 2: Generated Model (Cr8acCodeappstableModel.ts)

The model defines the schema of your Dataverse table:

```typescript
export interface ICr8acCodeappsTableCreateRequest {
  cr8ac_name?: string;
  cr8ac_description?: string;
  cr8ac_value?: number;
}

export interface Cr8acCodeappstable extends ICr8acCodeappsTableCreateRequest {
  cr8ac_codeappstableid: string; // Primary key
  createdon?: Date;
  modifiedon?: Date;
  statecode?: number;
  statuscode?: number;
}
```

## Step 3: Generated Service (Cr8acCodeappstableService.ts)

The service provides CRUD operations:

### Create a Record

```typescript
import { Cr8acCodeappstableService } from './generated/services/Cr8acCodeappstableService';
import type { ICr8acCodeappsTableCreateRequest } from './generated/models/Cr8acCodeappstableModel';

const newRecord: ICr8acCodeappsTableCreateRequest = {
  cr8ac_name: "My Record",
  cr8ac_description: "Sample description",
  cr8ac_value: 100
};

const result = await Cr8acCodeappstableService.create(newRecord);

if (result.error) {
  console.error('Create failed:', result.error);
} else {
  console.log('Created record:', result.data);
}
```

### Read a Single Record

```typescript
const recordId = "00000000-0000-0000-0000-000000000000"; // Replace with actual ID

const result = await Cr8acCodeappstableService.get(recordId);

if (result.error) {
  console.error('Get failed:', result.error);
} else {
  console.log('Retrieved record:', result.data);
}
```

### Read Multiple Records

```typescript
import type { IGetAllOptions } from './generated/services/Cr8acCodeappstableService';

const options: IGetAllOptions = {
  select: ['cr8ac_codeappstableid', 'cr8ac_name', 'cr8ac_description', 'cr8ac_value'],
  filter: "cr8ac_value gt 50",
  orderBy: ['cr8ac_name asc'],
  top: 50
};

const result = await Cr8acCodeappstableService.getAll(options);

if (result.error) {
  console.error('GetAll failed:', result.error);
} else {
  console.log('Retrieved records:', result.data);
}
```

### Query Options

The `IGetAllOptions` interface supports:

| Option | Type | Description |
|--------|------|-------------|
| `select` | `string[]` | Specific fields to retrieve |
| `filter` | `string` | OData filter expression |
| `orderBy` | `string[]` | Fields to sort by |
| `top` | `number` | Maximum records to return |
| `skip` | `number` | Records to skip for pagination |
| `skipToken` | `string` | Token for pagination |
| `maxPageSize` | `number` | Records per page |

### Update a Record

```typescript
const result = await Cr8acCodeappstableService.update(recordId, {
  cr8ac_name: "Updated Name",
  cr8ac_value: 200
});

if (result.error) {
  console.error('Update failed:', result.error);
} else {
  console.log('Record updated successfully');
}
```

### Delete a Record

```typescript
const result = await Cr8acCodeappstableService.delete(recordId);

if (result.error) {
  console.error('Delete failed:', result.error);
} else {
  console.log('Record deleted successfully');
}
```

## Step 4: Ensure Initialization Before Data Calls

Always ensure Power Apps SDK is initialized before performing data operations:

```typescript
import { usePowerAppsInit } from './hooks/usePowerAppsInit';
import { PowerAppsGuard } from './components/PowerAppsGuard';

const MyComponent = () => {
  const { isInitializing, error } = usePowerAppsInit();

  if (isInitializing) {
    return <div>Loading Power Apps SDK...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PowerAppsGuard>
      {/* Your component that uses Dataverse service */}
    </PowerAppsGuard>
  );
};
```

## Step 5: Use PowerAppsGuard

The `PowerAppsGuard` component automatically protects child components from rendering until Power Apps is initialized:

```tsx
<PowerAppsGuard>
  <YourDataverseComponent />
</PowerAppsGuard>
```

## Example Component

See `DataverseExample.tsx` for a complete working example that demonstrates:
- Loading all records
- Creating new records
- Deleting records
- Error handling
- Loading states

## Best Practices

✅ **Always use PowerAppsGuard** - Prevents rendering before SDK initialization
✅ **Limit select columns** - Only retrieve fields you need
✅ **Use filters** - Reduce data transferred
✅ **Handle errors gracefully** - Check `result.error` in all operations
✅ **Use pagination** - For large datasets use `top`, `skip`, and `skipToken`
✅ **Log operations** - Service logs all operations to console with `[Cr8acCodeappstableService]` prefix

## OData Filter Examples

```typescript
// Equal
filter: "cr8ac_value eq 100"

// Greater than
filter: "cr8ac_value gt 50"

// Contains
filter: "contains(cr8ac_name, 'test')"

// Combination (AND)
filter: "cr8ac_value gt 50 and cr8ac_name eq 'Active'"

// Combination (OR)
filter: "cr8ac_value lt 100 or cr8ac_name eq 'Inactive'"
```

## Troubleshooting

### "Power Apps data API not available"
- Ensure `usePowerAppsInit` is called before your component
- Wrap component with `PowerAppsGuard`
- Check browser console for detailed error logs

### No records returned
- Verify table name is correct: `cr8ac_codeappstable`
- Check OData filter syntax
- Use select to verify field names exist
- Check data exists in Dataverse

### Connection errors
- Verify PAC CLI is connected: `pac auth select`
- Ensure environment has Dataverse enabled
- Check connection reference in `power.config.json`

## Related Files

- `src/generated/models/Cr8acCodeappstableModel.ts` - Data model
- `src/generated/services/Cr8acCodeappstableService.ts` - CRUD service
- `src/components/DataverseExample.tsx` - Example component
- `src/hooks/usePowerAppsInit.ts` - Initialization hook
- `src/components/PowerAppsGuard.tsx` - Guard component
- `power.config.json` - Configuration with connection reference
