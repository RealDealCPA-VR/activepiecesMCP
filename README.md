# Activepieces MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to interact with Activepieces workflows. Built with TypeScript and inspired by the n8n-mcp project.

## 🚀 Features

- **Complete Flow Management**: Create, read, update, delete, enable/disable flows
- **Execution Control**: Trigger flows, monitor runs, retrieve execution logs
- **Piece Management**: List and explore available integrations
- **Project Management**: Access and manage Activepieces projects
- **Health Monitoring**: Check instance health and diagnostics
- **Multiple Deployment Options**: NPM, Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ (for NPM installation)
- Docker (for container deployment)
- An Activepieces instance (self-hosted or cloud)
- Activepieces API key (generated from Admin Console > Settings > API Keys)

## 🔧 Installation

### Option 1: NPM Package (Recommended)

```bash
# Install globally
npm install -g activepieces-mcp

# Or run directly with npx
npx activepieces-mcp
```

### Option 2: Docker

```bash
# Pull the image
docker pull activepieces-mcp:latest

# Run the container
docker run -i --rm \
  -e ACTIVEPIECES_API_URL="https://your-instance.activepieces.com/api/v1" \
  -e ACTIVEPIECES_API_KEY="your-api-key" \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  activepieces-mcp:latest
```

### Option 3: Docker Compose

```bash
# Clone the repository
git clone https://github.com/yourusername/activepieces-mcp.git
cd activepieces-mcp

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Start the server
docker-compose up -d
```

### Option 4: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/activepieces-mcp.git
cd activepieces-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Activepieces Instance Configuration
ACTIVEPIECES_API_URL=https://your-instance.activepieces.com/api/v1
ACTIVEPIECES_API_KEY=your-api-key-here

# MCP Server Configuration
MCP_MODE=stdio
LOG_LEVEL=error
DISABLE_CONSOLE_OUTPUT=true
```

### Getting Your API Key

1. Log in to your Activepieces instance
2. Navigate to **Admin Console** > **Settings** > **API Keys**
3. Click **Create API Key**
4. Copy the generated key (starts with `sk-`)

## 🤖 Claude Desktop Configuration

### NPM Installation

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "npx",
      "args": ["activepieces-mcp"],
      "env": {
        "ACTIVEPIECES_API_URL": "https://your-instance.activepieces.com/api/v1",
        "ACTIVEPIECES_API_KEY": "your-api-key",
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

### Docker Installation

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "ACTIVEPIECES_API_URL=https://your-instance.activepieces.com/api/v1",
        "-e", "ACTIVEPIECES_API_KEY=your-api-key",
        "-e", "MCP_MODE=stdio",
        "-e", "LOG_LEVEL=error",
        "-e", "DISABLE_CONSOLE_OUTPUT=true",
        "activepieces-mcp:latest"
      ]
    }
  }
}
```

### Local Installation

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "node",
      "args": ["/absolute/path/to/activepieces-mcp/dist/mcp/index.js"],
      "env": {
        "ACTIVEPIECES_API_URL": "https://your-instance.activepieces.com/api/v1",
        "ACTIVEPIECES_API_KEY": "your-api-key",
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

After configuration, restart Claude Desktop.

## 📚 Available Tools

### Flow Management
- `list_flows` - List all flows with optional filters
- `get_flow` - Get detailed flow information
- `create_flow` - Create a new flow
- `delete_flow` - Delete a flow
- `enable_flow` - Enable a flow
- `disable_flow` - Disable a flow

### Flow Run Management
- `list_flow_runs` - List flow execution runs
- `get_flow_run` - Get detailed run information
- `trigger_flow` - Manually trigger a flow
- `delete_flow_run` - Delete a flow run record

### Piece Management
- `list_pieces` - List available integrations
- `get_piece` - Get piece details

### Project Management
- `list_projects` - List all projects
- `get_project` - Get project details

### System Tools
- `health_check` - Check instance health
- `list_tools` - List all available tools
- `diagnostics` - Get connection diagnostics

## 💡 Usage Examples

### Example 1: List All Flows

Ask Claude:
```
Can you list all my Activepieces flows?
```

### Example 2: Create a New Flow

Ask Claude:
```
Create a new flow called "Email Notification" in project proj_abc123
```

### Example 3: Trigger a Flow

Ask Claude:
```
Trigger the flow with ID flow_xyz789 with this data: {"email": "user@example.com", "message": "Hello"}
```

### Example 4: Monitor Flow Runs

Ask Claude:
```
Show me all failed flow runs from the last hour
```

### Example 5: Get Flow Details

Ask Claude:
```
Get the details of flow flow_abc123 and explain what it does
```

## 🏗️ Project Structure

```
activepieces-mcp/
├── src/
│   ├── api/
│   │   └── client.ts          # Activepieces API client
│   ├── mcp/
│   │   ├── index.ts           # Main entry point
│   │   ├── server.ts          # MCP server implementation
│   │   └── tools.ts           # Tool definitions and handlers
│   ├── types/
│   │   └── activepieces.ts    # TypeScript type definitions
│   └── utils/                 # Utility functions
├── dist/                      # Compiled JavaScript
├── tests/                     # Test files
├── Dockerfile                 # Docker image definition
├── docker-compose.yml         # Docker Compose configuration
├── package.json               # NPM package configuration
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variable template
└── README.md                  # This file
```

## 🔨 Development

### Build the Project

```bash
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

### Clean Build

```bash
npm run clean
npm run rebuild
```

## 🐛 Troubleshooting

### Connection Issues

1. **Verify API URL**: Ensure your `ACTIVEPIECES_API_URL` ends with `/api/v1`
2. **Check API Key**: Verify your API key is valid and starts with `sk-`
3. **Test Connection**: Use the `diagnostics` tool to check connectivity

### Claude Desktop Not Detecting Server

1. **Restart Claude Desktop** completely after configuration changes
2. **Check Config File**: Ensure JSON is valid (no trailing commas)
3. **Verify Paths**: Use absolute paths for local installations
4. **Check Logs**: Look for errors in Claude Desktop logs

### Docker Issues

1. **Check Container Logs**: `docker logs activepieces-mcp`
2. **Verify Environment Variables**: Ensure all required vars are set
3. **Network Access**: Ensure container can reach your Activepieces instance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [n8n-mcp](https://github.com/czlonkowski/n8n-mcp) by Romuald Czlonkowski
- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Powered by [Activepieces](https://www.activepieces.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/activepieces-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/activepieces-mcp/discussions)
- **Activepieces Community**: [Community Forum](https://community.activepieces.com/)

## 🗺️ Roadmap

- [ ] HTTP mode support for remote access
- [ ] Webhook management tools
- [ ] Connection management tools
- [ ] Flow template management
- [ ] Bulk operations support
- [ ] Advanced filtering and search
- [ ] Flow validation and testing tools
- [ ] Performance metrics and analytics

---

Built with ❤️ for the Activepieces community
