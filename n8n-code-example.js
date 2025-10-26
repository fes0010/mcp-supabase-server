// ===== N8N CODE NODE EXAMPLES =====
// Copy these directly into n8n Code nodes

const BASE_URL = 'https://selfhostmcp.munene.shop';

// ===== EXAMPLE 1: Get All Products =====
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

// ===== EXAMPLE 2: Get Today's Transactions =====
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

return transactions.data.map(item => ({ json: item }));

// ===== EXAMPLE 3: Get Low Stock Products =====
const lowStock = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT name, sku, quantity FROM products WHERE quantity < 10 ORDER BY quantity ASC'
  },
  json: true
});

return lowStock.data.map(item => ({ json: item }));

// ===== EXAMPLE 4: Get This Month's Analytics (Single Object) =====
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const today2 = now.toISOString().split('T')[0];

const analytics = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/get_business_analytics`,
  body: {
    date_from: firstDay,
    date_to: today2
  },
  json: true
});

// For single object results, wrap in array
return [{ json: analytics.analytics }];

// ===== EXAMPLE 5: Insert New Customer =====
const insertResult = await this.helpers.httpRequest({
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

return [{ json: insertResult }];

// ===== EXAMPLE 6: Combined Report =====
const products = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT COUNT(*) as total FROM products'
  },
  json: true
});

const todayTransactions = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: `SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM transactions WHERE created_at::date = CURRENT_DATE`
  },
  json: true
});

// Return combined data as single item
return [{
  json: {
    total_products: products.data[0].total,
    today_transactions: todayTransactions.data[0].total,
    today_revenue: todayTransactions.data[0].revenue || 0
  }
}];

// ===== EXAMPLE 7: Process Multiple Items from Previous Node =====
// Get input from previous node
const items = $input.all();

// Process each item
const results = [];
for (const item of items) {
  const productId = item.json.product_id;
  
  const product = await this.helpers.httpRequest({
    method: 'POST',
    url: `${BASE_URL}/api/execute_sql`,
    body: {
      query: `SELECT * FROM products WHERE id = ${productId}`
    },
    json: true
  });
  
  if (product.data.length > 0) {
    results.push({ json: product.data[0] });
  }
}

return results;

// ===== EXAMPLE 8: Error Handling =====
try {
  const result = await this.helpers.httpRequest({
    method: 'POST',
    url: `${BASE_URL}/api/execute_sql`,
    body: {
      query: 'SELECT * FROM products LIMIT 10'
    },
    json: true
  });
  
  return result.data.map(item => ({ json: item }));
} catch (error) {
  // Return error as output
  return [{
    json: {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    }
  }];
}
