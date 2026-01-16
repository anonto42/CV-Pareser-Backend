import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
import config from '.';

dotenv.config();

export const qdrantClient = new QdrantClient({
    url: config.qdrant.url,
    apiKey: config.qdrant.apiKey,
});

export const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'cv_embeddings';

export async function ensureCollection(vectorDimension: number = 384) {
    try {
        
        try {
            const info = await qdrantClient.getCollection(COLLECTION_NAME);
            console.log(`Collection '${COLLECTION_NAME}' already exists. Status: ${info.status}`);
            
            const vectorSize = (info.config.params.vectors as any)?.size;

            if (vectorSize !== vectorDimension) {
                console.log(`Wrong vector size (${vectorSize}). Deleting and recreating...`);
                await qdrantClient.deleteCollection(COLLECTION_NAME);
                throw new Error('Wrong dimension, will recreate');
            }
            
            return;
            
        } catch (error: any) {
            
            // Create new collection
            await qdrantClient.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: vectorDimension,
                    distance: 'Cosine',
                },
            });
            
            console.log(`✅ Collection '${COLLECTION_NAME}' created with ${vectorDimension} dimensions.`);
        }
        
    } catch (error: any) {
        console.error('❌ Failed to ensure collection:', error.message);
        throw error;
    }
}
