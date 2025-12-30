import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ActivepiecesConfig,
  Flow,
  FlowRun,
  Piece,
  Project,
  CreateFlowRequest,
  ListFlowsParams,
  ListFlowRunsParams,
  PaginatedResponse,
  ApiResponse,
} from '../types/activepieces';

export class ActivepiecesClient {
  private client: AxiosInstance;
  private config: ActivepiecesConfig;

  constructor(config: ActivepiecesConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = error.response?.data || error.message;
        throw new Error(`Activepieces API Error: ${JSON.stringify(message)}`);
      }
    );
  }

  // Flow Management
  async listFlows(params?: ListFlowsParams): Promise<PaginatedResponse<Flow>> {
    const response = await this.client.get<PaginatedResponse<Flow>>('/flows', {
      params,
    });
    return response.data;
  }

  async getFlow(flowId: string): Promise<Flow> {
    const response = await this.client.get<Flow>(`/flows/${flowId}`);
    return response.data;
  }

  async createFlow(data: CreateFlowRequest): Promise<Flow> {
    const response = await this.client.post<Flow>('/flows', data);
    return response.data;
  }

  async updateFlow(flowId: string, operation: any): Promise<Flow> {
    const response = await this.client.post<Flow>(
      `/flows/${flowId}/operations`,
      operation
    );
    return response.data;
  }

  async deleteFlow(flowId: string): Promise<void> {
    await this.client.delete(`/flows/${flowId}`);
  }

  async enableFlow(flowId: string): Promise<Flow> {
    const response = await this.client.post<Flow>(`/flows/${flowId}/enable`);
    return response.data;
  }

  async disableFlow(flowId: string): Promise<Flow> {
    const response = await this.client.post<Flow>(`/flows/${flowId}/disable`);
    return response.data;
  }

  // Flow Run Management
  async listFlowRuns(params?: ListFlowRunsParams): Promise<PaginatedResponse<FlowRun>> {
    const response = await this.client.get<PaginatedResponse<FlowRun>>('/flow-runs', {
      params,
    });
    return response.data;
  }

  async getFlowRun(runId: string): Promise<FlowRun> {
    const response = await this.client.get<FlowRun>(`/flow-runs/${runId}`);
    return response.data;
  }

  async triggerFlow(flowId: string, payload?: any): Promise<FlowRun> {
    const response = await this.client.post<FlowRun>(`/flows/${flowId}/trigger`, {
      payload,
    });
    return response.data;
  }

  async deleteFlowRun(runId: string): Promise<void> {
    await this.client.delete(`/flow-runs/${runId}`);
  }

  // Piece Management
  async listPieces(params?: { projectId?: string }): Promise<Piece[]> {
    const response = await this.client.get<Piece[]>('/pieces', { params });
    return response.data;
  }

  async getPiece(pieceName: string, version?: string): Promise<Piece> {
    const params = version ? { version } : {};
    const response = await this.client.get<Piece>(`/pieces/${pieceName}`, { params });
    return response.data;
  }

  async installPiece(data: {
    packageType: 'ARCHIVE' | 'REGISTRY';
    scope: 'PLATFORM' | 'PROJECT';
    pieceName: string;
    pieceVersion: string;
    pieceArchive?: any;
  }): Promise<void> {
    await this.client.post('/pieces/install', data);
  }

  // Project Management
  async listProjects(): Promise<PaginatedResponse<Project>> {
    const response = await this.client.get<PaginatedResponse<Project>>('/projects');
    return response.data;
  }

  async getProject(projectId: string): Promise<Project> {
    const response = await this.client.get<Project>(`/projects/${projectId}`);
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; version?: string }> {
    try {
      const response = await this.client.get('/health');
      return { status: 'healthy', version: response.data?.version };
    } catch (error) {
      return { status: 'unhealthy' };
    }
  }

  // Get API Info
  getApiInfo(): { apiUrl: string; authenticated: boolean } {
    return {
      apiUrl: this.config.apiUrl,
      authenticated: !!this.config.apiKey,
    };
  }
}
