# Update HOST_URL for Production Deployment

## Current Issue
Your MCP server at `https://selfhostmcp.munene.shop` is showing `localhost` URLs because the `HOST_URL` environment variable is not set.

## Quick Fix

### If using Dokploy or similar:
1. Go to your deployment dashboard
2. Find the environment variables section
3. Add this environment variable:
   ```
   HOST_URL=https://selfhostmcp.munene.shop
   ```
4. Save and redeploy

### If using Docker directly:
```bash
docker run -d \
  --name mcp-supabase-server \
  --restart unless-stopped \
  -p 3001:3001 \
  -e SUPABASE_URL=https://supabase.munene.shop \
  -e SUPABASE_SERVICE_ROLE_KEY=your-key \
  -e HOST_URL=https://selfhostmcp.munene.shop \
  mcp-supabase
```

### If using systemd or PM2:
Add to your environment variables:
```bash
export HOST_URL=https://selfhostmcp.munene.shop
```

## After Updating
1. Rebuild and restart the server
2. Test with:
   ```bash
   curl https://selfhostmcp.munene.shop/health
   ```
3. You should now see:
   ```json
   {
     "status": "healthy",
     "mcp_endpoint": "https://selfhostmcp.munene.shop/mcp"
   }
   ```

## Verify in Cursor
Your MCP client should work with the URL `https://selfhostmcp.munene.shop/mcp` once this is configured.
