#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { ActivepiecesMCPServer } from './server';
import { ActivepiecesConfig } from '../types/activepieces';

// Load environment variables
dotenv.config();

// Get configuration from environment
const config: ActivepiecesConfig = {
  apiUrl: process.env.ACTIVEPIECES_API_URL || '',
  apiKey: process.env.ACTIVEPIECES_API_KEY || '',
};

// Validate configuration
if (!config.apiUrl) {
  console.error('Error: ACTIVEPIECES_API_URL environment variable is required');
  process.exit(1);
}

if (!config.apiKey) {
  console.error('Error: ACTIVEPIECES_API_KEY environment variable is required');
  process.exit(1);
}

// Get MCP mode from environment
const mcpMode = process.env.MCP_MODE || 'stdio';
const logLevel = process.env.LOG_LEVEL || 'error';
const disableConsoleOutput = process.env.DISABLE_CONSOLE_OUTPUT === 'true';

// Disable console output if requested (except errors)
if (disableConsoleOutput) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
}

// Start server based on mode
async function main() {
  try {
    if (mcpMode === 'http') {
      // HTTP mode (for future implementation)
      const port = parseInt(process.env.HTTP_PORT || '3000');
      const host = process.env.HTTP_HOST || '0.0.0.0';
      
      console.error(`HTTP mode not yet implemented. Use stdio mode instead.`);
      process.exit(1);
    } else {
      // STDIO mode (default)
      const server = new ActivepiecesMCPServer(config);
      await server.start();
    }
  } catch (error: any) {
    console.error('Failed to start Activepieces MCP server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
