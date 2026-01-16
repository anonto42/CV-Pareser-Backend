import { StructuredCV } from "../../../../shared/application/dto/StructuredCV.dto";
import { VectorRecord } from "../../../../shared/application/dto/VectorRecord.dto";

export type IChatReturn =  { 
  answer: string; 
  sources: { 
    vectorRecords: VectorRecord[]; 
    cvRecords: StructuredCV[] 
  } 
}