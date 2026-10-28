export type DocumentStatus = 'uploading' | 'processing' | 'indexed' | 'failed';

export interface DatasheetDocument {
  id: string;
  filename: string;
  partNumber: string;
  manufacturer: string;
  pageCount: number;
  status: DocumentStatus;
  progressPercent: number;
  uploadedAt: Date;
  tablesFound?: number;
}

export interface Citation {
  citationIndex: number;
  docId: string;
  partNumber: string;
  pageNumber: number;
  tableOrFigure?: string;
  snippet: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  groundingScore?: number;
  latencyMs?: number;
  isStreaming?: boolean;
}
