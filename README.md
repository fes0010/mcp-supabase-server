# MCP Server for Self-hosted Supabase

A minimal Model Context Protocol (MCP) server that provides full database control for self-hosted Supabase instances. Perfect for AI agents and n8n automation.

## 🚀 Features

- **Full SQL Control** - Execute any SQL query (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP)
- **9 Essential Tools** - Streamlined from 25+ tools to core functionality
- **Global Access** - Deploy to cloud for worldwide accessibility
- **n8n Compatible** - Direct integration with n8n MCP Client
- **Auto-restart** - Built-in health checks and error recovery
- **Secure** - Input validation and SQL injection protection

## 🎯 Quick Start

### Local Development
```bash
# Clone and setup
git clone https://github.com/fes0010/mcp-supabase-server.git
cd mcp-supabase-server
npm install

# Set environment variables
export SUPABASE_URL="https://your-supabase-url.com"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Build and start
npm run build
npm run start:mcp
```

**Local endpoint:** `http://localhost:3001/mcp`

### Cloud Deployment (Dokploy)
```bash
# Quick deploy to your VPS
./deploy-to-dokploy.sh
```

**Global endpoint:** `https://your-domain.com/mcp`

## 🔧 Available Tools

1. **`list_tables`** - List all database tables
2. **`get_table_schema`** - Get table structure with sample data
3. **`execute_sql`** - Execute any SQL query with full database control
4. **`get_table_data`** - Query table data with filtering and sorting
5. **`insert_data`** - Insert new records into tables
6. **`update_data`** - Update existing records
7. **`delete_data`** - Delete records from tables
8. **`get_business_analytics`** - Business insights and KPIs

## 📱 n8n Integration

### MCP Client Node Configuration:
- **Endpoint:** `https://your-domain.com/mcp` (or `http://localhost:3001/mcp`)
- **Server Transport:** `HTTP Streamable`
- **Authentication:** `None`
- **Tools to Include:** `All`

### Example Usage in n8n:
```javascript
// Get product count
execute_sql({
  query: "SELECT COUNT(*) as total FROM products"
})

// Add new product
insert_data({
  table_name: "products",
  data: {
    name: "New Product",
    sku: "NP001", 
    retail_price: 25.99
  }
})

// Business analytics
get_business_analytics({
  date_from: "2025-01-01",
  date_to: "2025-01-31"
})
```

## 🌐 Deployment Options

### 1. Dokploy (Recommended)
- Use `./deploy-to-dokploy.sh` for guided setup
- Automatic SSL, health checks, and monitoring
- See [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md) for details

### 2. Docker
```bash
docker build -t mcp-supabase .
docker run -d -p 3001:3001 \
  -e SUPABASE_URL="https://your-url.com" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-key" \
  mcp-supabase
```

### 3. PM2 (Local Auto-start)
```bash
./setup-autostart.sh
```

## 🔒 Security

- **Input Validation** - All parameters validated
- **SQL Injection Protection** - Parameterized queries
- **Required WHERE Clauses** - Prevents accidental mass operations
- **Service Role Authentication** - Uses Supabase service role key
- **HTTPS Support** - SSL encryption for cloud deployments

## 📊 Database Schema Support

Optimized for business management systems:
- `products` - Product inventory
- `transactions` - Sales records
- `customers` - Customer information  
- `expenses` - Business expenses
- `customer_debts` - Credit management

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start MCP server
npm run start:mcp

# Start HTTP API (alternative)
npm run start:http

# Run tests
npm test
```

## 📋 Environment Variables

```bash
SUPABASE_URL=https://your-supabase-instance.com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3001                    # Optional, defaults to 3001
NODE_ENV=production          # For production deployments
HOST_URL=https://your-domain.com  # For production deployments (replaces localhost in URLs)
```

## 🔍 Health Check

```bash
curl http://localhost:3001/health
# or
curl https://your-domain.com/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-25T10:30:00.000Z",
  "mcp_endpoint": "https://your-domain.com/mcp",
  "tools_available": 8
}
```

## 📚 Documentation

- [HTTP API Guide](HTTP_API_GUIDE.md) - REST API documentation
- [Dokploy Deployment](DOKPLOY_DEPLOYMENT.md) - Cloud deployment guide
- [Auto-start Guide](AUTOSTART_GUIDE.md) - Local auto-start setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/fes0010/mcp-supabase-server/issues)
- **Discussions:** [GitHub Discussions](https://github.com/fes0010/mcp-supabase-server/discussions)

---

**Built for AI agents, n8n automation, and business intelligence workflows.** 🤖✨