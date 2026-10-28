export interface ChunkMetadata {
  docId: string;
  partNumber: string;
  pageNumber: number;
  sectionTitle?: string;
  tableOrFigureId?: string;
  chunkType: 'table' | 'pinout' | 'prose' | 'register';
  tokenCount: number;
}

export interface DocumentChunk {
  chunkId: string;
  docId: string;
  partNumber: string;
  pageNumber: number;
  sectionTitle?: string;
  tableOrFigureId?: string;
  content: string;
  chunkType: 'table' | 'pinout' | 'prose' | 'register';
  embedding: number[];
  tokenCount: number;
}

export interface CitationItem {
  citationIndex: number;
  docId: string;
  partNumber: string;
  pageNumber: number;
  tableOrFigure?: string;
  snippet: string;
  confidence: number;
}

export interface ChatQueryRequest {
  query: string;
  activeDocIds: string[];
  sessionId?: string;
}

export interface ChatQueryResponse {
  answer: string;
  citations: CitationItem[];
  groundingScore: number;
  latencyMs: number;
}
