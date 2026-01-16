import { StructuredCV } from "../../../../shared/application/dto/StructuredCV.dto";
import { VectorRecord } from "../../../../shared/application/dto/VectorRecord.dto";

export interface IChatReturn { 
    answer: string; 
    sources: { 
      vectorRecords: VectorRecord[]; 
      cvRecords: StructuredCV[] 
    } 
  }