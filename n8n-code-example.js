// ===== N8N CODE NODE EXAMPLES =====
// Use these in n8n Code nodes (not fetch, use $http or this.helpers.httpRequest)

const BASE_URL = 'https://selfhostmcp.munene.shop';

// ===== EXAMPLE 1: Execute SQL Query =====
async function executeSQL(query, limit = 100) {
  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: `${BASE_URL}/api/execute_sql`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      query: query,
      limit: limit
    }
  });
  
  return response;
}

// ===== EXAMPLE 2: Get Table Data =====
async function getTableData(tableName, whereClause = '', limit = 50) {
  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: `${BASE_URL}/api/get_table_data`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      table_name: tableName,
      columns: '*',
      where_clause: whereClause,
      limit: limit,
      order_by: 'created_at',
      ascending: false
    }
  });
  
  return response;
}

// ===== EXAMPLE 3: Insert Data =====
async function insertData(tableName, data) {
  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: `${BASE_URL}/api/insert_data`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      table_name: tableName,
      data: data
    }
  });
  
  return response;
}

// ===== EXAMPLE 4: Get Business Analytics =====
async function getAnalytics(dateFrom, dateTo) {
  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: `${BASE_URL}/api/get_business_analytics`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      date_from: dateFrom,
      date_to: dateTo
    }
  });
  
  return response;
}

// ===== EXAMPLE 5: List Tables =====
async function listTables() {
  const response = await this.helpers.httpRequest({
    method: 'GET',
    url: `${BASE_URL}/api/list_tables`,
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  return response;
}

// ===== USAGE EXAMPLES =====

// Example 1: Get all products
const products = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT * FROM products LIMIT 10'
  },
  json: true
});

// Example 2: Get today's transactions
const today = new Date().toISOString().split('T')[0];
const transactions = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_table_data`,
  body: {
    table_name: 'transactions',
    where_clause: `created_at::date=eq.${today}`,
    limit: 50
  },
  json: true
});

// Example 3: Get this month's analytics
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const analytics = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_business_analytics`,
  body: {
    date_from: firstDay,
    date_to: today
  },
  json: true
});

// Return combined results
return [
  {
    json: {
      products: products.data,
      transactions: transactions.data,
      analytics: analytics.analytics
    }
  }
];
