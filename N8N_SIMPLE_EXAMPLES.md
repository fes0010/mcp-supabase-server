# Simple n8n Code Node Examples

## ⚡ Quick Start - Copy & Paste into n8n Code Node

### Example 1: Get All Products (Simple)

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT * FROM products LIMIT 10'
  },
  json: true
});

// n8n expects array of items with json property
return result.data.map(item => ({ json: item }));
```

### Example 2: Get Today's Sales

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';
const today = new Date().toISOString().split('T')[0];

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_table_data`,
  body: {
    table_name: 'transactions',
    where_clause: `created_at::date=eq.${today}`,
    limit: 100
  },
  json: true
});

return result.data.map(item => ({ json: item }));
```

### Example 3: Get Low Stock Products

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT name, sku, quantity FROM products WHERE quantity < 10 ORDER BY quantity ASC'
  },
  json: true
});

return result.data.map(item => ({ json: item }));
```

### Example 4: Get This Month's Analytics

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const today = now.toISOString().split('T')[0];

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_business_analytics`,
  body: {
    date_from: firstDay,
    date_to: today
  },
  json: true
});

// For single object, wrap in array with json property
return [{ json: result.analytics }];
```

### Example 5: Insert New Customer

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/insert_data`,
  body: {
    table_name: 'customers',
    data: {
      name: 'John Doe',
      phone: '+254700000000',
      email: 'john@example.com'
    }
  },
  json: true
});

return [{ json: result }];
```

### Example 6: Get Top 5 Selling Products

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: `
      SELECT 
        p.name,
        COUNT(ti.id) as times_sold,
        SUM(ti.quantity) as total_quantity,
        SUM(ti.total_price) as revenue
      FROM products p
      JOIN transaction_items ti ON p.id = ti.product_id
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT 5
    `
  },
  json: true
});

return result.data.map(item => ({ json: item }));
```

### Example 7: Get Customer Debts

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: `
      SELECT 
        c.name,
        c.phone,
        cd.total_debt,
        cd.paid_amount,
        cd.remaining_balance
      FROM customers c
      JOIN customer_debts cd ON c.id = cd.customer_id
      WHERE cd.remaining_balance > 0
      ORDER BY cd.remaining_balance DESC
    `
  },
  json: true
});

return result.data.map(item => ({ json: item }));
```

### Example 8: List All Tables

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const result = await this.helpers.httpRequest({
  method: 'GET',
  url: `${BASE_URL}/api/list_tables`,
  json: true
});

return result.tables.map(item => ({ json: item }));
```

## 🔧 How to Use

1. In n8n, add a **Code** node to your workflow
2. Copy one of the examples above
3. Paste into the Code node
4. Click "Execute Node" to test
5. The output will be available for the next node

## 📊 Return Format

All examples return data that can be used directly in the next node. The data structure depends on the query:

```javascript
// For queries that return arrays:
[
  { id: 1, name: 'Product 1', ... },
  { id: 2, name: 'Product 2', ... }
]

// For analytics:
{
  total_transactions: 150,
  total_revenue: 45000,
  ...
}
```

## ⚠️ Important Notes

1. **Use `this.helpers.httpRequest`** - not `fetch()` (fetch is not available in n8n)
2. **Set `json: true`** - to automatically parse JSON responses
3. **BASE_URL** - Update if your server URL changes
4. **SQL Injection** - The server validates and sanitizes inputs, but be careful with user input

## 🚀 Advanced: Using Input Data

If you want to use data from previous nodes:

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Get data from previous node
const inputData = $input.all();
const productId = inputData[0].json.product_id;

// Query using the input data
const result = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: `SELECT * FROM products WHERE id = ${productId}`
  },
  json: true
});

return result.data;
```

## 📝 Available Endpoints

- `POST /api/execute_sql` - Execute any SQL
- `POST /api/get_table_data` - Get filtered table data
- `POST /api/insert_data` - Insert records
- `GET /api/list_tables` - List all tables
- `POST /api/get_business_analytics` - Business metrics

## 🆘 Troubleshooting

**Error: "fetch is not defined"**
- Use `this.helpers.httpRequest` instead of `fetch()`

**Error: "Unexpected token"**
- Make sure `json: true` is set in httpRequest options

**No data returned**
- Check the server is running: `https://selfhostmcp.munene.shop/health`
- Verify your query syntax

**Connection timeout**
- Check your network connection
- Verify the server URL is correct

