# 🎯 Dataverse Integration - What You Can Do Now

## 🏗️ Architecture Overview

```
Your React Component
        ↓
  PowerAppsGuard (ensures SDK ready)
        ↓
  Cr8acCodeappstableService (CRUD)
        ↓
  Power Apps SDK (initialization)
        ↓
  Microsoft Dataverse (data)
```

## 💻 Code Examples

### Example 1: Basic CRUD Flow

```typescript
import { Cr8acCodeappstableService } from './generated/services/Cr8acCodeappstableService';
import { PowerAppsGuard } from './components/PowerAppsGuard';

export function MyApp() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      // READ
      const result = await Cr8acCodeappstableService.getAll({
        select: ['cr8ac_codeappstableid', 'cr8ac_name', 'cr8ac_value'],
        top: 50
      });
      if (result.data) setRecords(result.data);
    };
    
    loadData();
  }, []);

  const handleCreate = async (name: string, value: number) => {
    // CREATE
    const result = await Cr8acCodeappstableService.create({
      cr8ac_name: name,
      cr8ac_value: value
    });
    if (result.data) setRecords([...records, result.data]);
  };

  const handleDelete = async (id: string) => {
    // DELETE
    await Cr8acCodeappstableService.delete(id);
    setRecords(records.filter(r => r.cr8ac_codeappstableid !== id));
  };

  return (
    <PowerAppsGuard>
      {/* Your UI here */}
    </PowerAppsGuard>
  );
}
```

### Example 2: Advanced Querying

```typescript
// Filter records
const result = await Cr8acCodeappstableService.getAll({
  select: ['cr8ac_name', 'cr8ac_value'],
  filter: "cr8ac_value gt 100",
  orderBy: ['cr8ac_name asc'],
  top: 25,
  skip: 0  // For pagination
});

// Complex filter with AND/OR
const complexResult = await Cr8acCodeappstableService.getAll({
  filter: "(cr8ac_value gt 50 and cr8ac_value lt 200) or cr8ac_name eq 'Important'",
  select: ['cr8ac_name', 'cr8ac_value', 'cr8ac_description']
});
```

### Example 3: Error Handling

```typescript
try {
  const result = await Cr8acCodeappstableService.create({
    cr8ac_name: 'New Record',
    cr8ac_value: 100
  });

  if (result.error) {
    console.error('Failed:', result.error);
    showErrorMessage(result.error);
  } else {
    console.log('Success:', result.data);
    showSuccessMessage('Record created');
  }
} catch (err) {
  console.error('Unexpected error:', err);
}
```

## 📊 OData Filter Operators

```typescript
// Equals
filter: "cr8ac_value eq 100"

// Not equals
filter: "cr8ac_value ne 100"

// Greater than
filter: "cr8ac_value gt 50"

// Greater or equal
filter: "cr8ac_value ge 50"

// Less than
filter: "cr8ac_value lt 50"

// Less or equal
filter: "cr8ac_value le 50"

// String contains
filter: "contains(cr8ac_name, 'test')"

// String starts with
filter: "startswith(cr8ac_name, 'ABC')"

// Logical AND
filter: "cr8ac_value gt 50 and cr8ac_value lt 100"

// Logical OR
filter: "cr8ac_name eq 'Active' or cr8ac_name eq 'Pending'"

// Logical NOT
filter: "not startswith(cr8ac_name, 'Test')"

// Complex
filter: "(cr8ac_value gt 100 and cr8ac_status eq 1) or cr8ac_priority eq 'High'"
```

## 🔄 Operation Flow Diagram

### Create Flow
```
Create Button Click
        ↓
User enters data
        ↓
Cr8acCodeappstableService.create(data)
        ↓
Power Apps SDK sends request
        ↓
Dataverse creates record
        ↓
Response returned with ID
        ↓
UI updates with new record
```

### Read Flow
```
Component mounts / useEffect
        ↓
Cr8acCodeappstableService.getAll(options)
        ↓
Power Apps SDK builds OData query
        ↓
Dataverse executes query
        ↓
Results returned
        ↓
setState with records
        ↓
UI renders table/list
```

### Update Flow
```
Update Button Click
        ↓
Cr8acCodeappstableService.update(id, changes)
        ↓
Power Apps SDK sends PATCH request
        ↓
Dataverse updates record
        ↓
Refresh record from getAll()
        ↓
UI updates
```

### Delete Flow
```
Delete Button Click
        ↓
Confirm dialog
        ↓
Cr8acCodeappstableService.delete(id)
        ↓
Power Apps SDK sends DELETE request
        ↓
Dataverse deletes record
        ↓
Remove from local state
        ↓
UI updates (remove from list)
```

## 🛡️ Error Scenarios & Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Power Apps data API not available" | SDK not initialized | Wrap with PowerAppsGuard |
| "Record not found" | Invalid record ID | Check ID is valid |
| "Filter expression invalid" | Syntax error in OData | Review filter syntax |
| Network error | Connection issue | Check internet, retry |
| Permission denied | User lacks access | Check Dataverse permissions |

## 📈 Performance Tips

1. **Use select** - Only retrieve needed fields
   ```typescript
   select: ['cr8ac_name', 'cr8ac_value']  // Fast ✅
   // vs omit select - returns all fields  // Slow ❌
   ```

2. **Use filter** - Reduce records returned
   ```typescript
   filter: "cr8ac_status eq 'Active'"  // 10 records ✅
   // vs no filter - returns all        // 1000 records ❌
   ```

3. **Use pagination** - Handle large datasets
   ```typescript
   top: 50, skip: 0    // Page 1 ✅
   top: 50, skip: 50   // Page 2 ✅
   // vs getAll() - returns everything  // Slow ❌
   ```

4. **Use orderBy** - Server-side sorting
   ```typescript
   orderBy: ['cr8ac_name asc']  // Fast ✅
   // vs sort in JavaScript        // Slow ❌
   ```

## 🎨 Common UI Patterns

### Pattern 1: Table with Pagination
```typescript
const [page, setPage] = useState(0);
const pageSize = 50;

const loadPage = async (pageNum: number) => {
  const result = await Cr8acCodeappstableService.getAll({
    select: ['cr8ac_name', 'cr8ac_value'],
    skip: pageNum * pageSize,
    top: pageSize
  });
  setRecords(result.data || []);
  setPage(pageNum);
};

// Load next page
loadPage(page + 1);
```

### Pattern 2: Live Search
```typescript
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const search = async () => {
    if (!searchTerm) {
      loadAllRecords();
      return;
    }
    
    const result = await Cr8acCodeappstableService.getAll({
      filter: `contains(cr8ac_name, '${searchTerm}')`
    });
    setRecords(result.data || []);
  };
  
  // Debounce search
  const timer = setTimeout(search, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

### Pattern 3: Sortable Table
```typescript
const [sortBy, setSortBy] = useState('cr8ac_name');
const [sortDesc, setSortDesc] = useState(false);

const loadSorted = async (field: string) => {
  const newDesc = sortBy === field ? !sortDesc : false;
  const order = newDesc ? 'desc' : 'asc';
  
  const result = await Cr8acCodeappstableService.getAll({
    orderBy: [`${field} ${order}`]
  });
  
  setRecords(result.data || []);
  setSortBy(field);
  setSortDesc(newDesc);
};
```

## 📞 Debugging Tips

1. **Enable console logging**: All operations log to console
   ```
   [Cr8acCodeappstableService] Creating record...
   [Cr8acCodeappstableService] Record created successfully: {...}
   ```

2. **Check browser DevTools** (F12):
   - Console tab for logs
   - Network tab for API calls
   - Application tab for local storage

3. **Verify data exists**: Use Dataverse UI to confirm records exist

4. **Test with simple query first**:
   ```typescript
   // Start simple
   await Cr8acCodeappstableService.getAll();
   
   // Then add complexity
   await Cr8acCodeappstableService.getAll({ top: 10 });
   await Cr8acCodeappstableService.getAll({ filter: "..." });
   ```

---

**Ready to build?** Start with `QUICK_REFERENCE.md`! 🚀
