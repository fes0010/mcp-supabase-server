// ============================================
// SIMPLEST POSSIBLE VERSION - TRY THIS FIRST
// ============================================

const response = await this.helpers.request('https://selfhostmcp.munene.shop/api/list_tables');

const data = typeof response === 'string' ? JSON.parse(response) : response;

return data.tables.map(table => ({ json: table }));

// ============================================
// If that works, try this SQL version:
// ============================================

// const options = {
//   method: 'POST',
//   uri: 'https://selfhostmcp.munene.shop/api/execute_sql',
//   body: {
//     query: 'SELECT COUNT(*) as total FROM products'
//   },
//   json: true
// };

// const response = await this.helpers.request(options);
// return response.data.map(item => ({ json: item }));

// ============================================
// Alternative using $http (if available):
// ============================================

// const response = await $http.post('https://selfhostmcp.munene.shop/api/execute_sql', {
//   query: 'SELECT * FROM products LIMIT 5'
// });

// return response.data.data.map(item => ({ json: item }));

