#!/bin/bash

# MCP Server Setup Script
# This script helps configure the MCP server for your Supabase instance

echo "🚀 MCP Server Setup"
echo "=================="

# Check if .env file exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo ""
echo "Please provide your Supabase credentials:"
echo "You can find these in your Supabase project settings under API."

# Get Supabase URL
echo "Enter your Supabase URL (e.g., https://your-project.supabase.co):"
read -r supabase_url
if [ -z "$supabase_url" ]; then
    echo "❌ Supabase URL is required"
    exit 1
fi

# Get Supabase Service Role Key
echo "Enter your Supabase Service Role Key:"
read -r service_role_key
if [ -z "$service_role_key" ]; then
    echo "❌ Service Role Key is required"
    exit 1
fi

# Create .env file
cat > .env << EOF
# MCP Server Configuration
SUPABASE_URL=${supabase_url}
SUPABASE_SERVICE_ROLE_KEY=${service_role_key}
PORT=3001
NODE_ENV=development
EOF

echo ""
echo "✅ Configuration saved to .env file"

# Create .env.example if it doesn't exist
if [ ! -f .env.example ]; then
    cat > .env.example << EOF
# Example environment variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=3001
NODE_ENV=development
EOF
    echo "✅ Created .env.example template"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the server: npm run start:mcp"
    echo "2. Test the connection: curl http://localhost:3001/health"
    echo "3. Access MCP endpoint: http://localhost:3001/mcp"
    echo ""
    echo "For n8n integration:"
    echo "- Endpoint: http://localhost:3001/mcp"
    echo "- Server Transport: HTTP Streamable"
    echo "- Authentication: None"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
