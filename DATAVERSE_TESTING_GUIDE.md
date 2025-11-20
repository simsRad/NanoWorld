# Dataverse Table Testing Guide

## Current Status
✅ **Tables Confirmed to Exist:**
- `neo_wonlookup_master` (EntitySetName: `neo_wonlookup_masters`)
- `cr8ac_codeappstable` (EntitySetName: `cr8ac_codeappstables`)

✅ **Connection Working:**
- Connection ID: `b861225d5bd845dd8b07c966cf4f1c47`
- User: `simunye.r@nanofibre.co.uk`
- Environment: Nano World Production

## Table Schema Details

### neo_wonlookup_master Fields:
- `neo_wonlookup_masterid` (GUID, Primary Key)
- `neo_name` (string)
- `neo_description` (string)
- `neo_id` (string)
- `neo_active` (boolean)
- `neo_usedin` (string)
- Standard fields: `createdon`, `modifiedon`, `createdby`, `modifiedby`, `statecode`, `statuscode`, `ownerid`

### cr8ac_codeappstable Fields:
- `cr8ac_codeappstableid` (GUID, Primary Key)
- `cr8ac_name` (string)
- Standard fields: `createdon`, `modifiedon`, `createdby`, `modifiedby`, `statecode`, `statuscode`, `ownerid`

## Most Likely Issue
**The tables appear to be EMPTY (no records)** - This is why `retrieveMultipleRecordsAsync` returns 0 records.

## How to Verify in Browser Console

1. Open the app: https://apps.powerapps.com/play/e/4c1ca5bf-40c8-ef70-920e-ff3cdc04f0a1/a/d732aad0-0e1b-4a13-87e6-2ba94ecf78ba

2. Open Browser Developer Tools (F12)

3. Navigate to "Lookup Manager" or "Code Apps Table"

4. Check console logs for:
   ```
   [NeoWonlookupMasterService] Full API response: {entities: Array(0), ...}
   [Cr8acCodeappstableService] Full API response: {entities: Array(0), ...}
   ```

5. If you see `Array(0)`, the tables are empty

## Testing Record Creation (Browser Console)

To test if you have CREATE permissions, try this in the browser console:

```javascript
// Test creating a record in neo_wonlookup_master
const { createNeoWonlookupMaster } = await import('./src/generated/services/NeoWonlookupMasterService.ts');

const testRecord = {
  neo_name: "Test Entry",
  neo_description: "This is a test record",
  neo_id: "TEST001",
  neo_active: true,
  neo_usedin: "Testing"
};

const result = await createNeoWonlookupMaster(testRecord);
console.log('Create result:', result);
```

## Checking Permissions via Power Platform

### Option 1: Check via Power Apps Portal
1. Go to https://make.powerapps.com
2. Select "Nano World Production" environment
3. Navigate to "Tables" → "All"
4. Search for "neo_wonlookup_master" or "cr8ac_codeappstable"
5. Click on the table → "Data"
6. Try to add a new record manually

### Option 2: Check Security Roles
1. Go to https://make.powerapps.com
2. Settings → Security → Security roles
3. Find your security role
4. Check permissions for:
   - "Custom Entities" → "neo_wonlookup_master"
   - "Custom Entities" → "cr8ac_codeappstable"
5. Verify you have: Create, Read, Write, Delete, Append, Append To

## Expected Permissions Needed
- ✅ **Read** - To retrieve records
- ✅ **Create** - To add new records (if testing)
- ✅ **Write** - To update records
- ✅ **Delete** - To remove records

## Next Steps

1. **If tables are empty**: Add test data via Power Apps portal or programmatically
2. **If permission denied**: Contact admin to grant security role access
3. **If different error**: Check the browser console for the full error message

## Adding Test Data via Power Apps Portal

1. Go to: https://make.powerapps.com
2. Select environment: "Nano World Production"
3. Tables → All → Search for table name
4. Click "Edit data" or "Add record"
5. Fill in the fields:
   - For `neo_wonlookup_master`: neo_name, neo_description, neo_id, neo_active
   - For `cr8ac_codeappstable`: cr8ac_name
6. Save

Once you have data in the tables, the app will display it!
