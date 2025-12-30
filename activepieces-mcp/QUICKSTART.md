# Quick Start Guide

Get up and running with Activepieces MCP in 5 minutes!

## Prerequisites

- ✅ Activepieces instance (self-hosted or cloud)
- ✅ Activepieces API key
- ✅ Claude Desktop installed
- ✅ Node.js 18+ OR Docker installed

## Step 1: Get Your API Key

1. Log in to your Activepieces instance
2. Go to **Admin Console** → **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the key (starts with `sk-`)

## Step 2: Choose Your Installation Method

### Option A: NPM (Fastest)

```bash
# Install globally
npm install -g activepieces-mcp
```

### Option B: Docker

```bash
# Pull the image
docker pull activepieces-mcp:latest
```

### Option C: From Source

```bash
# Clone and build
git clone https://github.com/yourusername/activepieces-mcp.git
cd activepieces-mcp
npm install
npm run build
```

## Step 3: Configure Claude Desktop

### Find Your Config File

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Add Configuration

#### For NPM Installation:

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "npx",
      "args": ["activepieces-mcp"],
      "env": {
        "ACTIVEPIECES_API_URL": "https://your-instance.activepieces.com/api/v1",
        "ACTIVEPIECES_API_KEY": "sk-your-api-key-here",
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

#### For Docker Installation:

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "ACTIVEPIECES_API_URL=https://your-instance.activepieces.com/api/v1",
        "-e", "ACTIVEPIECES_API_KEY=sk-your-api-key-here",
        "-e", "MCP_MODE=stdio",
        "-e", "LOG_LEVEL=error",
        "-e", "DISABLE_CONSOLE_OUTPUT=true",
        "activepieces-mcp:latest"
      ]
    }
  }
}
```

**Important**: Replace:
- `your-instance.activepieces.com` with your actual instance URL
- `sk-your-api-key-here` with your actual API key

## Step 4: Restart Claude Desktop

Completely quit and restart Claude Desktop for changes to take effect.

## Step 5: Test the Connection

Open Claude Desktop and try these commands:

### Test 1: Check Connection
```
Can you check if my Activepieces instance is healthy?
```

### Test 2: List Projects
```
List all my Activepieces projects
```

### Test 3: List Flows
```
Show me all my flows in Activepieces
```

## Common First Tasks

### Create Your First Flow

```
Create a new flow called "Welcome Email" in my default project
```

### Trigger a Flow

```
Trigger the flow with ID flow_abc123
```

### Monitor Flow Runs

```
Show me all my recent flow runs
```

### Get Flow Details

```
Get details about flow flow_xyz789 and explain what it does
```

## Troubleshooting

### ❌ "Server not found" or "Connection failed"

**Solution**: Check your configuration:
1. Verify API URL ends with `/api/v1`
2. Verify API key starts with `sk-`
3. Restart Claude Desktop completely

### ❌ "Authentication failed"

**Solution**: 
1. Generate a new API key in Activepieces
2. Update your Claude config
3. Restart Claude Desktop

### ❌ "Command not found: npx"

**Solution**: Install Node.js 18+ from [nodejs.org](https://nodejs.org)

### ❌ Docker errors

**Solution**:
```bash
# Check if Docker is running
docker ps

# Pull the image again
docker pull activepieces-mcp:latest
```

## Next Steps

Now that you're set up, explore more:

1. **Read the full documentation**: [README.md](README.md)
2. **Learn about all tools**: Ask Claude "What tools are available for Activepieces?"
3. **Explore deployment options**: [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Join the community**: [Activepieces Community](https://community.activepieces.com/)

## Example Workflows

### Workflow 1: Create and Test a Flow

```
1. Create a new flow called "Data Processor"
2. Get the flow ID from the response
3. Trigger the flow with test data
4. Check the run status
```

### Workflow 2: Monitor Failed Runs

```
1. List all failed flow runs
2. Get details of each failed run
3. Analyze the error messages
```

### Workflow 3: Manage Multiple Flows

```
1. List all flows in a project
2. Disable flows that aren't needed
3. Enable flows for production
```

## Getting Help

- **Documentation**: Check [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/activepieces-mcp/issues)
- **Community**: [Activepieces Forum](https://community.activepieces.com/)

## Tips for Success

1. **Start Simple**: Begin with basic commands like listing flows
2. **Use Diagnostics**: Run diagnostics if something isn't working
3. **Check Logs**: Look at Claude Desktop logs for errors
4. **Test Connection**: Use health_check tool to verify connectivity
5. **Read Responses**: Claude will show detailed responses from Activepieces

---

🎉 **Congratulations!** You're now ready to automate Activepieces with AI!
