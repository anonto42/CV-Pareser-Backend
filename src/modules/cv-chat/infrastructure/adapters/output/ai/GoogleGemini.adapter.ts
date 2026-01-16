import { AIModelPort } from "../../../../application/ports/output/AIModel.port";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

export class GoogleGeminiAdapter implements AIModelPort {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateAnswer(prompt: string, context?: string): Promise<string> {
    try {
      const fullPrompt = context ? `${context}\n\nPlease answer based on the above information.\n\nQuestion: ${prompt}` : prompt;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      return response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error generating answer with Gemini:", error);
      throw error;
    }
  }

  async generateAnswerWithMetadata(
    prompt: string,
    context?: string
  ): Promise<{ text: string; metadata?: Record<string, any> }> {
    try {
      const fullPrompt = context ? `${context}\n\nPlease answer based on the above information.\n\nQuestion: ${prompt}` : prompt;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't generate a response.";

      return {
        text,
        metadata: {
          model: 'gemini-2.5-flash',
          safetyRatings: response?.candidates?.[0]?.safetyRatings,
          finishReason: response?.candidates?.[0]?.finishReason
        }
      };
    } catch (error) {
      console.error("Error generating answer with metadata from Gemini:", error);
      throw error;
    }
  }
}
