import { VectorRecord } from "../../../../shared/application/dto/VectorRecord.dto";
import { StructuredCV } from "../../../../shared/application/dto/StructuredCV.dto";

export interface ChatRequest {
  prompt: string;
  includeContext?: boolean;
  topK?: number;
}

export interface ChatResponse {
  answer: string;
  sources: {
    vectorRecords: VectorRecord[];
    cvRecords: StructuredCV[];
  };
  metadata?: {
    model: string;
    tokensUsed?: number;
    processingTimeMs?: number;
  };
}

export interface ChatContext {
  vectorSearchResults: VectorRecord[];
  cvData: StructuredCV[];
  prompt: string;
}
