import { ActivepiecesClient } from '../api/client';
import { z } from 'zod';

export interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  handler: (client: ActivepiecesClient, args: any) => Promise<any>;
}

// Flow Management Tools
export const listFlowsTool: Tool = {
  name: 'list_flows',
  description: 'List all flows in Activepieces. Optionally filter by projectId or folderId.',
  inputSchema: z.object({
    projectId: z.string().optional().describe('Filter flows by project ID'),
    folderId: z.string().optional().describe('Filter flows by folder ID'),
    limit: z.number().optional().describe('Maximum number of flows to return'),
  }),
  handler: async (client, args) => {
    const flows = await client.listFlows(args);
    return {
      success: true,
      data: flows,
      message: `Found ${flows.data.length} flows`,
    };
  },
};

export const getFlowTool: Tool = {
  name: 'get_flow',
  description: 'Get detailed information about a specific flow by ID.',
  inputSchema: z.object({
    flowId: z.string().describe('The ID of the flow to retrieve'),
  }),
  handler: async (client, args) => {
    const flow = await client.getFlow(args.flowId);
    return {
      success: true,
      data: flow,
      message: `Retrieved flow: ${flow.version.displayName}`,
    };
  },
};

export const createFlowTool: Tool = {
  name: 'create_flow',
  description: 'Create a new flow in Activepieces.',
  inputSchema: z.object({
    displayName: z.string().describe('The name of the flow'),
    projectId: z.string().describe('The project ID where the flow will be created'),
    folderId: z.string().optional().describe('Optional folder ID to organize the flow'),
    folderName: z.string().optional().describe('Optional folder name'),
    metadata: z.record(z.any()).optional().describe('Optional metadata for the flow'),
  }),
  handler: async (client, args) => {
    const flow = await client.createFlow(args);
    return {
      success: true,
      data: flow,
      message: `Created flow: ${flow.version.displayName} (ID: ${flow.id})`,
    };
  },
};

export const deleteFlowTool: Tool = {
  name: 'delete_flow',
  description: 'Delete a flow from Activepieces.',
  inputSchema: z.object({
    flowId: z.string().describe('The ID of the flow to delete'),
  }),
  handler: async (client, args) => {
    await client.deleteFlow(args.flowId);
    return {
      success: true,
      message: `Flow ${args.flowId} deleted successfully`,
    };
  },
};

export const enableFlowTool: Tool = {
  name: 'enable_flow',
  description: 'Enable a flow to start processing triggers.',
  inputSchema: z.object({
    flowId: z.string().describe('The ID of the flow to enable'),
  }),
  handler: async (client, args) => {
    const flow = await client.enableFlow(args.flowId);
    return {
      success: true,
      data: flow,
      message: `Flow ${flow.version.displayName} enabled successfully`,
    };
  },
};

export const disableFlowTool: Tool = {
  name: 'disable_flow',
  description: 'Disable a flow to stop processing triggers.',
  inputSchema: z.object({
    flowId: z.string().describe('The ID of the flow to disable'),
  }),
  handler: async (client, args) => {
    const flow = await client.disableFlow(args.flowId);
    return {
      success: true,
      data: flow,
      message: `Flow ${flow.version.displayName} disabled successfully`,
    };
  },
};

// Flow Run Management Tools
export const listFlowRunsTool: Tool = {
  name: 'list_flow_runs',
  description: 'List flow execution runs. Filter by projectId, flowId, or status.',
  inputSchema: z.object({
    projectId: z.string().optional().describe('Filter by project ID'),
    flowId: z.string().optional().describe('Filter by flow ID'),
    status: z.enum(['RUNNING', 'SUCCEEDED', 'FAILED', 'PAUSED', 'STOPPED']).optional().describe('Filter by run status'),
    limit: z.number().optional().describe('Maximum number of runs to return'),
  }),
  handler: async (client, args) => {
    const runs = await client.listFlowRuns(args);
    return {
      success: true,
      data: runs,
      message: `Found ${runs.data.length} flow runs`,
    };
  },
};

export const getFlowRunTool: Tool = {
  name: 'get_flow_run',
  description: 'Get detailed information about a specific flow run.',
  inputSchema: z.object({
    runId: z.string().describe('The ID of the flow run to retrieve'),
  }),
  handler: async (client, args) => {
    const run = await client.getFlowRun(args.runId);
    return {
      success: true,
      data: run,
      message: `Retrieved flow run: ${run.flowVersion.displayName} (Status: ${run.status})`,
    };
  },
};

export const triggerFlowTool: Tool = {
  name: 'trigger_flow',
  description: 'Manually trigger a flow execution with optional payload data.',
  inputSchema: z.object({
    flowId: z.string().describe('The ID of the flow to trigger'),
    payload: z.record(z.any()).optional().describe('Optional payload data to pass to the flow'),
  }),
  handler: async (client, args) => {
    const run = await client.triggerFlow(args.flowId, args.payload);
    return {
      success: true,
      data: run,
      message: `Flow triggered successfully. Run ID: ${run.id}`,
    };
  },
};

export const deleteFlowRunTool: Tool = {
  name: 'delete_flow_run',
  description: 'Delete a flow run record.',
  inputSchema: z.object({
    runId: z.string().describe('The ID of the flow run to delete'),
  }),
  handler: async (client, args) => {
    await client.deleteFlowRun(args.runId);
    return {
      success: true,
      message: `Flow run ${args.runId} deleted successfully`,
    };
  },
};

// Piece Management Tools
export const listPiecesTool: Tool = {
  name: 'list_pieces',
  description: 'List all available pieces (integrations) in Activepieces.',
  inputSchema: z.object({
    projectId: z.string().optional().describe('Filter pieces by project ID'),
  }),
  handler: async (client, args) => {
    const pieces = await client.listPieces(args);
    return {
      success: true,
      data: pieces,
      message: `Found ${pieces.length} pieces`,
    };
  },
};

export const getPieceTool: Tool = {
  name: 'get_piece',
  description: 'Get detailed information about a specific piece (integration).',
  inputSchema: z.object({
    pieceName: z.string().describe('The name of the piece to retrieve'),
    version: z.string().optional().describe('Optional specific version of the piece'),
  }),
  handler: async (client, args) => {
    const piece = await client.getPiece(args.pieceName, args.version);
    return {
      success: true,
      data: piece,
      message: `Retrieved piece: ${piece.displayName}`,
    };
  },
};

// Project Management Tools
export const listProjectsTool: Tool = {
  name: 'list_projects',
  description: 'List all projects in Activepieces.',
  inputSchema: z.object({}),
  handler: async (client, args) => {
    const projects = await client.listProjects();
    return {
      success: true,
      data: projects,
      message: `Found ${projects.data.length} projects`,
    };
  },
};

export const getProjectTool: Tool = {
  name: 'get_project',
  description: 'Get detailed information about a specific project.',
  inputSchema: z.object({
    projectId: z.string().describe('The ID of the project to retrieve'),
  }),
  handler: async (client, args) => {
    const project = await client.getProject(args.projectId);
    return {
      success: true,
      data: project,
      message: `Retrieved project: ${project.displayName}`,
    };
  },
};

// System Tools
export const healthCheckTool: Tool = {
  name: 'health_check',
  description: 'Check the health status of the Activepieces instance.',
  inputSchema: z.object({}),
  handler: async (client, args) => {
    const health = await client.healthCheck();
    return {
      success: true,
      data: health,
      message: `Activepieces instance is ${health.status}`,
    };
  },
};

export const listToolsTool: Tool = {
  name: 'list_tools',
  description: 'List all available MCP tools for Activepieces.',
  inputSchema: z.object({}),
  handler: async (client, args) => {
    return {
      success: true,
      data: {
        tools: allTools.map(t => ({
          name: t.name,
          description: t.description,
        })),
      },
      message: `${allTools.length} tools available`,
    };
  },
};

export const diagnosticsTool: Tool = {
  name: 'diagnostics',
  description: 'Get diagnostic information about the Activepieces connection.',
  inputSchema: z.object({}),
  handler: async (client, args) => {
    const apiInfo = client.getApiInfo();
    const health = await client.healthCheck();
    return {
      success: true,
      data: {
        ...apiInfo,
        health: health.status,
        version: health.version,
      },
      message: 'Diagnostics retrieved successfully',
    };
  },
};

// Export all tools
export const allTools: Tool[] = [
  // Flow Management
  listFlowsTool,
  getFlowTool,
  createFlowTool,
  deleteFlowTool,
  enableFlowTool,
  disableFlowTool,
  // Flow Run Management
  listFlowRunsTool,
  getFlowRunTool,
  triggerFlowTool,
  deleteFlowRunTool,
  // Piece Management
  listPiecesTool,
  getPieceTool,
  // Project Management
  listProjectsTool,
  getProjectTool,
  // System Tools
  healthCheckTool,
  listToolsTool,
  diagnosticsTool,
];
