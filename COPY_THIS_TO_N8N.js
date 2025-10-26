// ============================================
// COPY THIS EXACT CODE INTO YOUR N8N CODE NODE
// ============================================

const BASE_URL = 'https://selfhostmcp.munene.shop';

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${BASE_URL}/api/execute_sql`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'SELECT * FROM products LIMIT 10'
  })
});

// Parse the response if it's a string
const result = typeof response === 'string' ? JSON.parse(response) : response;

// Return in n8n format
return result.data.map(item => ({ json: item }));

// ============================================
// Alternative simpler version (try this first):
// ============================================

// const response = await this.helpers.request({
//   method: 'POST',
//   url: 'https://selfhostmcp.munene.shop/api/execute_sql',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     query: 'SELECT * FROM products LIMIT 10'
//   }),
//   json: true
// });

// return response.data.map(item => ({ json: item }));
