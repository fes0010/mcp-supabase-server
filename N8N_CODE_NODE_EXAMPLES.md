# n8n Code Node Examples

Use these code snippets in n8n Code nodes to interact with your MCP server directly.

## Base Configuration

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';
```

## Example 1: Execute SQL Query

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Execute any SQL query
const response = await fetch(`${BASE_URL}/api/execute_sql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'SELECT * FROM products WHERE quantity < 10',
    limit: 50
  })
});

const result = await response.json();
return result.data;
```

## Example 2: Get Table Data with Filtering

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Get today's transactions
const today = new Date().toISOString().split('T')[0];

const response = await fetch(`${BASE_URL}/api/get_table_data`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    table_name: 'transactions',
    columns: '*',
    where_clause: `created_at::date=eq.${today}`,
    limit: 100,
    order_by: 'created_at',
    ascending: false
  })
});

const result = await response.json();
return result.data;
```

## Example 3: Insert New Record

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Insert a new customer
const response = await fetch(`${BASE_URL}/api/insert_data`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    table_name: 'customers',
    data: {
      name: 'John Doe',
      phone: '+254700000000',
      email: 'john@example.com'
    }
  })
});

const result = await response.json();
return result;
```

## Example 4: Get Business Analytics

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Get this month's analytics
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const today = now.toISOString().split('T')[0];

const response = await fetch(`${BASE_URL}/api/get_business_analytics`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date_from: firstDay,
    date_to: today
  })
});

const result = await response.json();
return result.analytics;
```

## Example 5: List All Tables

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await fetch(`${BASE_URL}/api/list_tables`);
const result = await response.json();

return result.tables;
```

## Example 6: Get Low Stock Products

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await fetch(`${BASE_URL}/api/execute_sql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      SELECT 
        id,
        name,
        sku,
        quantity,
        min_stock_level,
        retail_price
      FROM products 
      WHERE quantity < min_stock_level 
      ORDER BY quantity ASC
    `,
    limit: 50
  })
});

const result = await response.json();
return result.data;
```

## Example 7: Get Top Selling Products

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Get top 10 products by sales
const response = await fetch(`${BASE_URL}/api/execute_sql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      SELECT 
        p.name,
        p.sku,
        COUNT(ti.id) as times_sold,
        SUM(ti.quantity) as total_quantity,
        SUM(ti.total_price) as total_revenue
      FROM products p
      JOIN transaction_items ti ON p.id = ti.product_id
      GROUP BY p.id, p.name, p.sku
      ORDER BY total_revenue DESC
      LIMIT 10
    `
  })
});

const result = await response.json();
return result.data;
```

## Example 8: Complete Workflow - Sales Report

```javascript
const BASE_URL = 'https://selfhostmcp.munene.shop';

// Get date range (last 7 days)
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);

const dateFrom = startDate.toISOString().split('T')[0];
const dateTo = endDate.toISOString().split('T')[0];

// Get analytics
const analyticsResponse = await fetch(`${BASE_URL}/api/get_business_analytics`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ date_from: dateFrom, date_to: dateTo })
});
const analytics = await analyticsResponse.json();

// Get top products
const topProductsResponse = await fetch(`${BASE_URL}/api/execute_sql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      SELECT 
        p.name,
        SUM(ti.quantity) as quantity_sold,
        SUM(ti.total_price) as revenue
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      JOIN transactions t ON ti.transaction_id = t.id
      WHERE t.created_at::date BETWEEN '${dateFrom}' AND '${dateTo}'
      GROUP BY p.name
      ORDER BY revenue DESC
      LIMIT 5
    `
  })
});
const topProducts = await topProductsResponse.json();

// Combine results
return {
  period: { from: dateFrom, to: dateTo },
  summary: analytics.analytics,
  top_products: topProducts.data
};
```

## Usage in n8n Workflow

1. **Add a Code Node**
2. **Copy one of the examples above**
3. **Modify as needed**
4. **The node will return the data for downstream processing**

## Available API Endpoints

- `GET /api/list_tables` - List all tables
- `POST /api/execute_sql` - Execute any SQL query
- `POST /api/get_table_data` - Get table data with filtering
- `POST /api/insert_data` - Insert new records
- `POST /api/get_business_analytics` - Get business analytics

All endpoints return JSON with this structure:
```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:
```json
{
  "error": "Error message",
  "message": "Detailed error info"
}
```

