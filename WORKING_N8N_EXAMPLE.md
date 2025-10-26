# ✅ Working n8n Code Node Example

## Version 1: Using this.helpers.request (Recommended)

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    query: 'SELECT * FROM products LIMIT 10'
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

## Version 2: Using this.helpers.httpRequest

```javascript
const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://selfhostmcp.munene.shop/api/execute_sql',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'SELECT * FROM products LIMIT 10'
  })
});

// Parse response if it's a string
const result = typeof response === 'string' ? JSON.parse(response) : response;

return result.data.map(item => ({ json: item }));
```

## More Working Examples

### Example 1: Get Today's Transactions

```javascript
const today = new Date().toISOString().split('T')[0];

const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/get_table_data',
  body: {
    table_name: 'transactions',
    where_clause: `created_at::date=eq.${today}`,
    limit: 50
  },
  json: true
});

if (!response.data || response.data.length === 0) {
  return [{ json: { message: 'No transactions today' } }];
}

return response.data.map(item => ({ json: item }));
```

### Example 2: Get Business Analytics

```javascript
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const today = now.toISOString().split('T')[0];

const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/get_business_analytics',
  body: {
    date_from: firstDay,
    date_to: today
  },
  json: true
});

return [{ json: response.analytics }];
```

### Example 3: List All Tables

```javascript
const response = await this.helpers.request({
  method: 'GET',
  uri: 'https://selfhostmcp.munene.shop/api/list_tables',
  json: true
});

return response.tables.map(table => ({ json: table }));
```

### Example 4: Insert Customer

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/insert_data',
  body: {
    table_name: 'customers',
    data: {
      name: 'John Doe',
      phone: '+254700000000'
    }
  },
  json: true
});

return [{ json: response }];
```

### Example 5: Get Low Stock Products

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  body: {
    query: 'SELECT name, sku, quantity FROM products WHERE quantity < 10 ORDER BY quantity ASC'
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

### Example 6: Count Total Products

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  body: {
    query: 'SELECT COUNT(*) as total FROM products'
  },
  json: true
});

// Returns: [{ json: { total: 42 } }]
return response.data.map(item => ({ json: item }));
```

## Key Differences

### ✅ Use `this.helpers.request`
- Set `json: true` to auto-parse
- Use `uri` (not `url`)
- Pass `body` as object (not stringified)

### ❌ Don't use `this.helpers.httpRequest` with `json: true`
- It can cause the "response property should be a string" error
- If you use it, don't set `json: true` and parse manually

## Return Format

Always return an array with `json` property:

```javascript
// Multiple items
return response.data.map(item => ({ json: item }));

// Single item
return [{ json: response.analytics }];

// Error handling
if (!response.data) {
  return [{ json: { error: 'No data' } }];
}
```

## Testing

1. Add Code node
2. Copy example above
3. Click "Execute Node"
4. Should see items in output ✅

## Troubleshooting

**"response property should be a string"**
- Use `this.helpers.request` instead of `this.helpers.httpRequest`
- OR remove `json: true` and parse manually

**"Wrong output type"**
- Make sure you return `array.map(item => ({ json: item }))`
- Not just `array` or `object`

**"No data"**
- Check server is running: `https://selfhostmcp.munene.shop/health`
- Verify query syntax
