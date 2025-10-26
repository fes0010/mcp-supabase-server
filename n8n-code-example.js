// n8n Code Node Example for MCP Server
// Use this in a Code node to call your MCP server tools

// Configuration
const MCP_URL = 'https://selfhostmcp.munene.shop/mcp';

// Example 1: List all tables
async function listTables() {
  const response = await fetch(`${MCP_URL}/tools/list_tables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schema: 'public'
    })
  });
  
  return await response.json();
}

// Example 2: Execute SQL Query
async function executeSQL(query) {
  const response = await fetch(`${MCP_URL}/tools/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      limit: 100
    })
  });
  
  return await response.json();
}

// Example 3: Get table data with filtering
async function getTableData(tableName, whereClause = '', limit = 50) {
  const response = await fetch(`${MCP_URL}/tools/get_table_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      table_name: tableName,
      columns: '*',
      where_clause: whereClause,
      limit: limit,
      order_by: 'created_at',
      ascending: false
    })
  });
  
  return await response.json();
}

// Example 4: Insert data
async function insertData(tableName, data) {
  const response = await fetch(`${MCP_URL}/tools/insert_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      table_name: tableName,
      data: data
    })
  });
  
  return await response.json();
}

// Example 5: Get business analytics
async function getAnalytics(dateFrom, dateTo) {
  const response = await fetch(`${MCP_URL}/tools/get_business_analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date_from: dateFrom,
      date_to: dateTo
    })
  });
  
  return await response.json();
}

// ===== USAGE IN N8N CODE NODE =====

// Example: Get all products
const products = await executeSQL('SELECT * FROM products LIMIT 10');

// Example: Get today's transactions
const today = new Date().toISOString().split('T')[0];
const transactions = await getTableData('transactions', `created_at::date = '${today}'`);

// Example: Get sales analytics for this month
const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
const analytics = await getAnalytics(firstDay, today);

// Return the results
return {
  products: products,
  transactions: transactions,
  analytics: analytics
};

