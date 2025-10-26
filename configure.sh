#!/bin/bash

# MCP Server Configuration Script
# This script helps update the MCP server configuration

echo "🔧 MCP Server Configuration"
echo "=========================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run setup.sh first or create a .env file manually."
    exit 1
fi

echo "Current configuration:"
if [ -f .env ]; then
    echo "📄 .env file contents:"
    cat .env
    echo ""
fi

echo "Do you want to update the configuration? (y/N)"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Configuration not updated."
    exit 0
fi

# Get Supabase URL
echo "Enter your Supabase URL (current: $(grep "SUPABASE_URL" .env | cut -d'=' -f2- || echo "not set")):"
read -r supabase_url
if [ -z "$supabase_url" ]; then
    supabase_url=$(grep "SUPABASE_URL" .env | cut -d'=' -f2-)
fi

# Get Supabase Service Role Key
echo "Enter your Supabase Service Role Key (current: $(grep "SUPABASE_SERVICE_ROLE_KEY" .env | cut -d'=' -f2- | cut -c1-20)...):"
read -r service_role_key
if [ -z "$service_role_key" ]; then
    service_role_key=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env | cut -d'=' -f2-)
fi

# Get Port
echo "Enter port number (current: $(grep "PORT" .env | cut -d'=' -f2- || echo "3001")):"
read -r port
if [ -z "$port" ]; then
    port=$(grep "PORT" .env | cut -d'=' -f2- || echo "3001")
fi

# Update .env file
cat > .env << EOF
# MCP Server Configuration
SUPABASE_URL=${supabase_url}
SUPABASE_SERVICE_ROLE_KEY=${service_role_key}
PORT=${port}
NODE_ENV=development
EOF

echo ""
echo "✅ Configuration updated!"

# Rebuild the project
echo ""
echo "🔨 Rebuilding project with new configuration..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Configuration updated and rebuilt successfully!"
    echo ""
    echo "You can now restart the server to use the new configuration:"
    echo "npm run start:mcp"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
