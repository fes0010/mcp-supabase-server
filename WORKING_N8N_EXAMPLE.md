# ✅ Working n8n Code Node Example

## Copy This - It Works!

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Make the API call
const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT * FROM products LIMIT 10'
  },
  json: true
});

// Check if we got data
if (!response.data) {
  return [{ json: { error: 'No data returned' } }];
}

// Return in n8n format
return response.data.map(item => ({ json: item }));
```

## More Examples That Work

### Example 1: Get Today's Transactions

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';
const today = new Date().toISOString().split('T')[0];

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_table_data`,
  body: {
    table_name: 'transactions',
    where_clause: `created_at::date=eq.${today}`,
    limit: 50
  },
  json: true
});

if (!response.data) {
  return [{ json: { message: 'No transactions today' } }];
}

return response.data.map(item => ({ json: item }));
```

### Example 2: Get Business Analytics (Single Result)

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const today = now.toISOString().split('T')[0];

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_business_analytics`,
  body: {
    date_from: firstDay,
    date_to: today
  },
  json: true
});

// For single object results, wrap in array
return [{ json: response.analytics }];
```

### Example 3: List All Tables

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await this.helpers.httpRequest({
  method: 'GET',
  url: `${BASE_URL}/api/list_tables`,
  json: true
});

// Response has 'tables' property
return response.tables.map(table => ({ json: table }));
```

### Example 4: Insert New Record

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/insert_data`,
  body: {
    table_name: 'customers',
    data: {
      name: 'John Doe',
      phone: '+254700000000'
    }
  },
  json: true
});

// Return the insert result
return [{ json: response }];
```

### Example 5: Count Products

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT COUNT(*) as total FROM products'
  },
  json: true
});

// Even single row queries return an array
return response.data.map(item => ({ json: item }));
// Output: [{ json: { total: 42 } }]
```

## Understanding the Response Structure

All API endpoints return:
```json
{
  "success": true,
  "data": [...],      // for SQL queries and table data
  "tables": [...],    // for list_tables
  "analytics": {...}  // for analytics
}
```

## Return Format Rules

1. **Multiple rows** → Use `.map()`
```javascript
return response.data.map(item => ({ json: item }));
```

2. **Single object** → Wrap in array
```javascript
return [{ json: response.analytics }];
```

3. **Empty results** → Return message
```javascript
if (!response.data || response.data.length === 0) {
  return [{ json: { message: 'No results found' } }];
}
```

## Testing Your Code

1. Add a **Code** node
2. Copy one of the examples above
3. Click "Execute Node" (not "Execute Workflow")
4. Check the output panel below

If you see items in the output panel, it worked! ✅

