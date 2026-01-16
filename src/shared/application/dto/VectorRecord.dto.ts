import { CVSectionType } from "./StructuredCV.dto";

export interface VectorRecord {
  id: string;
  text: string;
  embedding?: number[];
  metadata: {
    cvId: string;
    section: CVSectionType;
    chunkIndex: number;
    email?: string;
    phone?: string;
    location?: string;
    skills?: string[];
  };
};
