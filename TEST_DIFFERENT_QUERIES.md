# Test Different Queries in n8n

Copy these one at a time into your n8n Code node to verify the server returns different data.

## Test 1: Count Products (Should return: { total: 638 })

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  body: {
    query: 'SELECT COUNT(*) as total FROM products'
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

## Test 2: Get Just Product Names (Should return 3 names)

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  body: {
    query: 'SELECT name FROM products LIMIT 3'
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

## Test 3: Get Customers (Should return customer data)

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/get_table_data',
  body: {
    table_name: 'customers',
    limit: 2
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

## Test 4: List Tables (Should return 8 tables)

```javascript
const response = await this.helpers.request({
  method: 'GET',
  uri: 'https://selfhostmcp.munene.shop/api/list_tables',
  json: true
});

return response.tables.map(table => ({ json: table }));
```

## Test 5: Get Transactions Count

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  body: {
    query: 'SELECT COUNT(*) as total FROM transactions'
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

## Test 6: Get Today's Date (Should change daily)

```javascript
const response = await this.helpers.request({
  method: 'POST',
  uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
  body: {
    query: 'SELECT CURRENT_DATE as today, NOW() as now'
  },
  json: true
});

return response.data.map(item => ({ json: item }));
```

## If You're Getting Same Response

1. **Check the query in your code** - Make sure you're actually changing the query string
2. **Clear n8n cache** - Try restarting your n8n workflow
3. **Check execution** - Make sure you're clicking "Execute Node" not "Test Workflow"
4. **Look at the output carefully** - The structure might be the same but data different

## Expected Outputs

Test 1: `{ total: 638 }`
Test 2: `{ name: "901 kenstar cup" }`, `{ name: "50Z party cups" }`, etc.
Test 3: Customer objects with names and phone numbers
Test 4: List of table names (products, customers, transactions, etc.)
Test 5: `{ total: <some number> }`
Test 6: Current date and timestamp

If all tests return the same data, there might be n8n caching. Try:
- Save and re-execute the workflow
- Restart n8n
- Use an HTTP Request node instead of Code node

