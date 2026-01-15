import OpenAI from 'openai';
import config from '../config';

export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: config.openai.embeddingModel,
      input: text,
    });
    
    return response.data[0].embedding;
  }

  async analyzeCV(cvText: string): Promise<any> {
    const prompt = `
      Analyze this CV and extract structured information:
      
      ${cvText}
      
      Return JSON with:
      - name: string
      - email: string
      - phone: string (if available)
      - skills: string[]
      - experience: Array<{ title: string, company: string, duration: string }>
      - education: Array<{ degree: string, institution: string, year: string }>
      - summary: string (professional summary)
    `;

    const response = await this.client.chat.completions.create({
      model: config.openai.completionModel,
      messages: [
        { role: 'system', content: 'You are a CV parsing assistant. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}