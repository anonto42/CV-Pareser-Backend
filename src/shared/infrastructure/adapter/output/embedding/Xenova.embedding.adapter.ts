import { pipeline } from '@xenova/transformers';
import { EmbeddingModelPort } from '../../../../application/port/output/EmbeddingModel.port';
import config from '../../../config';

type PipelineType =
  | 'feature-extraction'
  | 'text-classification'
  | 'token-classification'
  | 'question-answering'
  | 'translation'
  | 'summarization'
  | 'text-generation'
  | 'text2text-generation'
  | 'fill-mask'
  | 'sentence-similarity'
  | 'zero-shot-classification'
  | 'table-question-answering'
  | 'conversational'
  | 'automatic-speech-recognition'
  | 'text-to-audio'
  | 'audio-to-audio'
  | 'audio-classification'
  | 'voice-activity-detection'
  | 'depth-estimation'
  | 'image-classification'
  | 'object-detection'
  | 'image-segmentation'
  | 'text-to-image'
  | 'image-to-text'
  | 'image-to-image'
  | 'unconditional-image-generation'
  | 'video-classification'
  | 'reinforcement-learning'
  | 'robotics'
  | 'tabular-classification'
  | 'tabular-regression'
  | 'tabular-to-text'
  | 'time-series-forecasting'
  | 'document-question-answering'
  | 'graph-machine-learning'
  | 'mask-generation';

class EmbeddingPipeline {
  static task: PipelineType = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: any = null;

  static async getInstance() {
    if (this.instance === null) this.instance = await pipeline(this.task as any, this.model);
  
    return this.instance;
  }
}

function fallbackEmbedding(text: string): number[] {
  const embedding = new Array(config.vector.dimension).fill(0);
  const words = text.toLowerCase().split(/\s+/);

  words.forEach(word => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (let i = 0; i < 10; i++) {
      const idx = Math.abs(hash + i) % config.vector.dimension;
      embedding[idx] += 0.1;
    }
  });

  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    return embedding.map(val => val / norm);
  }
  return embedding;
}

export class XenovaEmbeddingAdapter implements EmbeddingModelPort {
  private vectorDimension = config.vector.dimension; 

  async embedText(text: string): Promise<number[]> {
    try {
      const extractor = await EmbeddingPipeline.getInstance();
      const result = await extractor(text, {
        pooling: 'mean',
        normalize: true,
      });

      const embeddings = Array.from(result.data) as number[];
      return embeddings;
    } catch (error) {
      console.error('❌ Xenova embedding error:', error);
      return fallbackEmbedding(text);
    }
  }

  getVectorDimension(): number {
    return this.vectorDimension;
  }
}
