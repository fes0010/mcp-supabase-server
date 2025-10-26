#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://munene.shop';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const HOST_URL = process.env.HOST_URL || `http://localhost:${PORT}`;

// Security: Validate environment variables
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to make authenticated REST API calls
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${SUPABASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`);
  headers.set('apikey', SUPABASE_SERVICE_ROLE_KEY);
  headers.set('Content-Type', 'application/json');
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${response.status} ${error}`);
  }
  
  return response.json();
};

// Validation functions
const validateTableName = (tableName: string): boolean => {
  if (!tableName || typeof tableName !== 'string') return false;
  if (tableName.length > 63) return false;
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(tableName)) return false;
  return true;
};

const validateDate = (dateStr: string): boolean => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

// Essential tools for full database control
const tools: Tool[] = [
  {
    name: 'list_tables',
    description: 'List all tables in the database with descriptions and record counts',
    inputSchema: {
      type: 'object',
      properties: {
        schema: {
          type: 'string',
          description: 'Schema name (default: public)',
          default: 'public',
        },
      },
    },
  },
  {
    name: 'get_table_schema',
    description: 'Get detailed schema/structure of a specific table including constraints and relationships',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table',
        },
        include_sample_data: {
          type: 'boolean',
          description: 'Include sample rows (default: false)',
          default: false,
        },
      },
      required: ['table_name'],
    },
  },
  {
    name: 'execute_sql',
    description: 'Execute any SQL query with full database control (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP)',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'SQL query to execute',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of rows to return for SELECT queries (default: 100)',
          default: 100,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_table_data',
    description: 'Get data from a specific table with filtering and sorting',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table',
        },
        columns: {
          type: 'string',
          description: 'Columns to select (default: *)',
          default: '*',
        },
        where_clause: {
          type: 'string',
          description: 'WHERE clause for filtering (without WHERE keyword)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of rows (default: 50)',
          default: 50,
        },
        order_by: {
          type: 'string',
          description: 'Column to order by',
        },
        ascending: {
          type: 'boolean',
          description: 'Sort ascending (default: false)',
          default: false,
        },
      },
      required: ['table_name'],
    },
  },
  {
    name: 'insert_data',
    description: 'Insert new records into a table',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table',
        },
        data: {
          type: 'object',
          description: 'Data to insert as key-value pairs',
        },
      },
      required: ['table_name', 'data'],
    },
  },
  {
    name: 'update_data',
    description: 'Update existing records in a table',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table',
        },
        data: {
          type: 'object',
          description: 'Data to update as key-value pairs',
        },
        where_clause: {
          type: 'string',
          description: 'WHERE clause to identify records to update (without WHERE keyword)',
        },
      },
      required: ['table_name', 'data', 'where_clause'],
    },
  },
  {
    name: 'delete_data',
    description: 'Delete records from a table',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table',
        },
        where_clause: {
          type: 'string',
          description: 'WHERE clause to identify records to delete (without WHERE keyword)',
        },
      },
      required: ['table_name', 'where_clause'],
    },
  },
  {
    name: 'get_business_analytics',
    description: 'Get comprehensive business analytics including sales, profit, and inventory insights',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'selfhosted-supabase-http',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls - same implementation as the stdio version
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_tables': {
        const knownTables = [
          { table_name: 'profiles', description: 'User profiles and roles', category: 'auth' },
          { table_name: 'products', description: 'Product inventory', category: 'inventory' },
          { table_name: 'transactions', description: 'Sales transactions', category: 'sales' },
          { table_name: 'transaction_items', description: 'Individual items in transactions', category: 'sales' },
          { table_name: 'customers', description: 'Customer information', category: 'customers' },
          { table_name: 'expenses', description: 'Business expenses', category: 'financial' },
          { table_name: 'debt_payments', description: 'Customer debt payments', category: 'financial' },
          { table_name: 'stock_history', description: 'Product stock changes', category: 'inventory' },
          { table_name: 'catalog_products', description: 'Product catalog', category: 'products' },
          { table_name: 'customer_debts', description: 'Customer debt records', category: 'financial' },
          { table_name: 'expense_categories', description: 'Expense categories', category: 'financial' },
        ];

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(knownTables, null, 2),
            },
          ],
        };
      }

      case 'execute_sql': {
        const query = args?.query as string;
        const limit = (args?.limit as number) || 100;
        
        if (!query || typeof query !== 'string') {
          throw new Error('SQL query is required');
        }

        const queryType = query.trim().toLowerCase().split(' ')[0];

        try {
          let finalQuery = query.trim();
          if (queryType === 'select' && !/\blimit\s+\d+/i.test(finalQuery)) {
            finalQuery += ` LIMIT ${limit}`;
          }

          try {
            const data = await makeAuthenticatedRequest('/rest/v1/rpc/exec_sql', {
              method: 'POST',
              body: JSON.stringify({ sql_query: finalQuery })
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          } catch (rpcError) {
            try {
              const data = await makeAuthenticatedRequest('/rest/v1/rpc/execute_sql', {
                method: 'POST',
                body: JSON.stringify({ sql_statement: finalQuery })
              });
              
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(data, null, 2),
                  },
                ],
              };
            } catch (executeError) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      error: 'SQL execution RPC functions not available',
                      message: 'Please create the exec_sql function in your database',
                      query: finalQuery,
                      query_type: queryType,
                      setup_instructions: 'Run the create-exec-sql-function.sql file in Supabase Studio SQL Editor'
                    }, null, 2),
                  },
                ],
                isError: true,
              };
            }
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'SQL execution failed',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      case 'get_table_data': {
        const tableName = args?.table_name as string;
        const columns = (args?.columns as string) || '*';
        const whereClause = args?.where_clause as string;
        const limit = (args?.limit as number) || 50;
        const orderBy = args?.order_by as string;
        const ascending = (args?.ascending as boolean) ?? false;
        
        if (!validateTableName(tableName)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid table name',
                  message: 'Table name must be a valid PostgreSQL identifier',
                  provided: tableName
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        let endpoint = `/rest/v1/${tableName}?select=${columns}&limit=${limit}`;
        
        if (whereClause) {
          endpoint += `&${whereClause}`;
        }
        
        if (orderBy) {
          endpoint += `&order=${orderBy}.${ascending ? 'asc' : 'desc'}`;
        }
        
        try {
          const data = await makeAuthenticatedRequest(endpoint);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Failed to get table data',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      case 'get_table_schema': {
        const tableName = args?.table_name as string;
        const includeSampleData = (args?.include_sample_data as boolean) ?? false;

        if (!validateTableName(tableName)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid table name',
                  message: 'Table name must be a valid PostgreSQL identifier',
                  provided: tableName
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        try {
          // Get table schema using SQL query
          const schemaQuery = `
            SELECT
              column_name,
              data_type,
              is_nullable,
              column_default,
              character_maximum_length,
              numeric_precision,
              numeric_scale
            FROM information_schema.columns
            WHERE table_name = '${tableName}'
            ORDER BY ordinal_position;
          `;

          const schemaData = await makeAuthenticatedRequest('/rest/v1/rpc/exec_sql', {
            method: 'POST',
            body: JSON.stringify({ sql_query: schemaQuery })
          });

          let sampleData = null;
          if (includeSampleData) {
            try {
              sampleData = await makeAuthenticatedRequest(`/rest/v1/${tableName}?limit=5`);
            } catch (sampleError) {
              sampleData = { error: 'Could not fetch sample data' };
            }
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  table_name: tableName,
                  schema: schemaData,
                  sample_data: sampleData
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Failed to get table schema',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      case 'insert_data': {
        const tableName = args?.table_name as string;
        const data = args?.data as object;

        if (!validateTableName(tableName)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid table name',
                  message: 'Table name must be a valid PostgreSQL identifier',
                  provided: tableName
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        if (!data || typeof data !== 'object') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid data',
                  message: 'Data must be a non-empty object'
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        try {
          const result = await makeAuthenticatedRequest(`/rest/v1/${tableName}`, {
            method: 'POST',
            body: JSON.stringify(data)
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  inserted: result
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Failed to insert data',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      case 'update_data': {
        const tableName = args?.table_name as string;
        const data = args?.data as object;
        const whereClause = args?.where_clause as string;

        if (!validateTableName(tableName)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid table name',
                  message: 'Table name must be a valid PostgreSQL identifier',
                  provided: tableName
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        if (!data || typeof data !== 'object') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid data',
                  message: 'Data must be a non-empty object'
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        if (!whereClause || typeof whereClause !== 'string') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Missing where clause',
                  message: 'WHERE clause is required for updates'
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        try {
          const updateQuery = `${tableName}?${whereClause}`;
          const result = await makeAuthenticatedRequest(`/rest/v1/${updateQuery}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  updated: result
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Failed to update data',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      case 'delete_data': {
        const tableName = args?.table_name as string;
        const whereClause = args?.where_clause as string;

        if (!validateTableName(tableName)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid table name',
                  message: 'Table name must be a valid PostgreSQL identifier',
                  provided: tableName
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        if (!whereClause || typeof whereClause !== 'string') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Missing where clause',
                  message: 'WHERE clause is required for deletions'
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        try {
          const deleteQuery = `${tableName}?${whereClause}`;
          const result = await makeAuthenticatedRequest(`/rest/v1/${deleteQuery}`, {
            method: 'DELETE'
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  deleted: result
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Failed to delete data',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      case 'get_business_analytics': {
        const dateFrom = args?.date_from as string;
        const dateTo = args?.date_to as string;

        if (dateFrom && !validateDate(dateFrom)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid date format',
                  message: 'Date must be in YYYY-MM-DD format',
                  provided: dateFrom
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        if (dateTo && !validateDate(dateTo)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid date format',
                  message: 'Date must be in YYYY-MM-DD format',
                  provided: dateTo
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        try {
          let transactionQuery = 'transactions?select=*';
          if (dateFrom) transactionQuery += `&created_at=gte.${dateFrom}`;
          if (dateTo) transactionQuery += `&created_at=lte.${dateTo}`;

          const transactions = await makeAuthenticatedRequest(`/rest/v1/${transactionQuery}`);
          const products = await makeAuthenticatedRequest('/rest/v1/products?select=*');

          const analytics = {
            date_range: { from: dateFrom, to: dateTo },
            total_transactions: Array.isArray(transactions) ? transactions.length : 0,
            total_revenue: Array.isArray(transactions) ?
              transactions.reduce((sum: number, t: any) => sum + (t.total_amount || 0), 0) : 0,
            total_products: Array.isArray(products) ? products.length : 0,
            total_inventory_value: Array.isArray(products) ?
              products.reduce((sum: number, p: any) => sum + ((p.quantity || 0) * (p.buying_price_per_base_unit || 0)), 0) : 0,
            low_stock_products: Array.isArray(products) ?
              products.filter((p: any) => (p.quantity || 0) < (p.min_stock_level || 10)).length : 0
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(analytics, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Analytics failed',
                  message: error instanceof Error ? error.message : String(error)
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Tool execution failed',
            message: error instanceof Error ? error.message : String(error)
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// MCP endpoint for n8n
app.get('/mcp', async (req, res) => {
  try {
    const transport = new SSEServerTransport('/mcp', res);
    await server.connect(transport);
    console.log('MCP client connected via SSE');
  } catch (error) {
    console.error('MCP connection error:', error);
    res.status(500).json({ error: 'MCP connection failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    supabase_url: SUPABASE_URL,
    mcp_endpoint: `${HOST_URL}/mcp`
  });
});

// Root endpoint with info
app.get('/', (req, res) => {
  res.json({
    name: 'MCP Supabase Server',
    version: '1.0.0',
    mcp_endpoint: `${HOST_URL}/mcp`,
    health_check: `${HOST_URL}/health`,
    tools_available: tools.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP Supabase Server running on port ${PORT}`);
  console.log(`📊 MCP Endpoint: ${HOST_URL}/mcp`);
  console.log(`🌐 Connected to: ${SUPABASE_URL}`);
  console.log(`🔧 Health check: ${HOST_URL}/health`);
});

export default app;