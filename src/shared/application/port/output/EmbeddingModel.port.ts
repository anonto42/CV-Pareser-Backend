export interface EmbeddingModelPort {
  embedText(text: string): Promise<number[]>;
  getVectorDimension(): number;
}
