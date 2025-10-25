# Deploy MCP Server to Dokploy

## 🎯 Goal: Make your MCP endpoint accessible from anywhere

Your endpoint will be: `https://mcp-supabase.yourdomain.com/mcp`

## Step 1: Prepare Repository

1. **Repository is ready:**
```bash
# Already created at:
https://github.com/fes0010/mcp-supabase-server
```

## Step 2: Deploy with Dokploy

### Option A: Using Dokploy Web Interface

1. **Login to your Dokploy dashboard**
   - Go to `https://your-vps-ip:3000` or your Dokploy domain

2. **Create New Application:**
   - Click "Create Application"
   - Name: `mcp-supabase-server`
   - Type: `Docker`

3. **Configure Source:**
   - Repository: `https://github.com/fes0010/mcp-supabase-server.git`
   - Branch: `main`
   - Build Pack: `Dockerfile`

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://munene.shop
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ```

5. **Configure Domain:**
   - Add domain: `mcp-api.yourdomain.com`
   - Enable HTTPS/SSL
   - Port: `3001`

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Option B: Using Docker Compose (Manual)

1. **SSH to your VPS:**
```bash
ssh user@your-vps-ip
```

2. **Clone and setup:**
```bash
git clone https://github.com/fes0010/mcp-supabase-server.git
cd mcp-supabase-server
```

3. **Create environment file:**
```bash
cat > .env << EOF
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://munene.shop
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
EOF
```

4. **Deploy with Docker:**
```bash
docker build -t mcp-supabase .
docker run -d \
  --name mcp-supabase-server \
  --restart unless-stopped \
  -p 3001:3001 \
  --env-file .env \
  mcp-supabase
```

## Step 3: Test Deployment

1. **Check health:**
```bash
curl https://mcp-api.yourdomain.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-25T...",
  "mcp_endpoint": "https://mcp-api.yourdomain.com/mcp"
}
```

## Step 4: Update n8n Configuration

### n8n MCP Client Configuration:
- **Endpoint:** `https://mcp-api.yourdomain.com/mcp`
- **Server Transport:** `HTTP Streamable`
- **Authentication:** `None`
- **Tools to Include:** `All`

### Global Access:
- Use from any device worldwide
- Mobile n8n apps
- Cloud n8n instances
- Team collaboration

## 🎉 Final Result

Your MCP server is now globally accessible:

✅ **Global endpoint:** `https://mcp-api.yourdomain.com/mcp`  
✅ **Always online:** Auto-restarts on failure  
✅ **SSL secured:** HTTPS encryption  
✅ **Scalable:** Multiple connections supported  
✅ **Monitored:** Health checks and logging  

Your Smart Traders database is now accessible via AI agents from anywhere! 🌍