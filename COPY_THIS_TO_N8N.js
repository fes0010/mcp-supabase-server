// ============================================
// COPY THIS EXACT CODE INTO YOUR N8N CODE NODE
// ============================================

const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  body: {
    query: 'SELECT * FROM products LIMIT 10'
  },
  json: true
});

return response.data.map(item => ({ json: item }));

// ============================================
// That's it! This will return products as n8n items
// ============================================

