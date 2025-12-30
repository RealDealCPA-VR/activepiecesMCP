// Activepieces API Types

export interface ActivepiecesConfig {
  apiUrl: string;
  apiKey: string;
}

export interface Flow {
  id: string;
  created: string;
  updated: string;
  projectId: string;
  externalId?: string;
  status: 'ENABLED' | 'DISABLED';
  operationStatus: 'NONE' | 'PENDING';
  version: FlowVersion;
}

export interface FlowVersion {
  id: string;
  created: string;
  updated: string;
  flowId: string;
  displayName: string;
  trigger: Trigger;
  valid: boolean;
  agentIds?: string[];
  state: 'LOCKED' | 'UNLOCKED';
  connectionIds?: string[];
  updatedBy?: string;
  schemaVersion?: string;
}

export interface Trigger {
  name: string;
  valid: boolean;
  displayName: string;
  type: 'PIECE_TRIGGER' | 'WEBHOOK' | 'SCHEDULE';
  settings: TriggerSettings;
  nextAction?: Action;
}

export interface TriggerSettings {
  propertySettings?: Record<string, any>;
  pieceName?: string;
  pieceVersion?: string;
  input?: Record<string, any>;
  sampleData?: SampleData;
  customLogoUrl?: string;
  triggerName?: string;
}

export interface SampleData {
  sampleDataFileId?: string;
  sampleDataInputFileId?: string;
  lastTestDate?: string;
}

export interface Action {
  name: string;
  displayName: string;
  type: 'PIECE' | 'CODE' | 'BRANCH' | 'LOOP';
  settings: ActionSettings;
  nextAction?: Action;
}

export interface ActionSettings {
  propertySettings?: Record<string, any>;
  pieceName?: string;
  pieceVersion?: string;
  actionName?: string;
  input?: Record<string, any>;
}

export interface FlowRun {
  id: string;
  created: string;
  updated: string;
  projectId: string;
  flowId: string;
  flowVersionId: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'PAUSED' | 'STOPPED';
  environment: 'PRODUCTION' | 'TESTING';
  parentRunId?: string;
  tags?: string[];
  flowVersion: {
    displayName: string;
  };
  logsFileId?: string;
  startTime: string;
  finishTime?: string;
}

export interface Piece {
  name: string;
  displayName: string;
  version: string;
  description?: string;
  logoUrl?: string;
  categories?: string[];
  auth?: PieceAuth;
  actions?: Record<string, PieceAction>;
  triggers?: Record<string, PieceTrigger>;
}

export interface PieceAuth {
  type: 'OAUTH2' | 'SECRET_TEXT' | 'BASIC_AUTH' | 'CUSTOM_AUTH';
  required: boolean;
}

export interface PieceAction {
  displayName: string;
  description?: string;
  props?: Record<string, any>;
}

export interface PieceTrigger {
  displayName: string;
  description?: string;
  type: 'POLLING' | 'WEBHOOK';
  props?: Record<string, any>;
}

export interface Project {
  id: string;
  created: string;
  updated: string;
  ownerId: string;
  displayName: string;
  platformId: string;
  type: 'TEAM' | 'PERSONAL';
}

export interface CreateFlowRequest {
  displayName: string;
  projectId: string;
  folderId?: string;
  folderName?: string;
  metadata?: Record<string, any>;
}

export interface ListFlowsParams {
  projectId?: string;
  folderId?: string;
  cursor?: string;
  limit?: number;
}

export interface ListFlowRunsParams {
  projectId?: string;
  flowId?: string;
  status?: FlowRun['status'];
  cursor?: string;
  limit?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  next?: string;
  previous?: string;
}
