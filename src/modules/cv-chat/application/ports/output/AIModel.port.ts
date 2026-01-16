export interface AIModelPort {
  generateAnswer(prompt: string, context?: string): Promise<string>;
  generateAnswerWithMetadata(prompt: string, context?: string): Promise<{ text: string; metadata?: Record<string, any> }>;
}
