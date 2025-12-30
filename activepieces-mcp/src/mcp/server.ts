import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ActivepiecesClient } from '../api/client';
import { allTools } from './tools';
import { ActivepiecesConfig } from '../types/activepieces';

export class ActivepiecesMCPServer {
  private server: Server;
  private client: ActivepiecesClient;

  constructor(config: ActivepiecesConfig) {
    this.client = new ActivepiecesClient(config);
    this.server = new Server(
      {
        name: 'activepieces-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allTools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: {
            type: 'object',
            properties: tool.inputSchema.shape || {},
            required: Object.keys(tool.inputSchema.shape || {}).filter(
              (key) => !tool.inputSchema.shape[key].isOptional()
            ),
          },
        })),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const toolName = request.params.name;
      const tool = allTools.find((t) => t.name === toolName);

      if (!tool) {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      try {
        // Validate input
        const validatedArgs = tool.inputSchema.parse(request.params.arguments);

        // Execute tool
        const result = await tool.handler(this.client, validatedArgs);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error.message || 'Unknown error occurred',
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Activepieces MCP server running on stdio');
  }
}
