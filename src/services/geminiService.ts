

import { GoogleGenAI } from "@google/genai";
import { IMAGE_GENERATION_MODEL } from '../constants';
import type { AspectRatio } from '../types';

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  numberOfImages: number,
  apiKey: string
): Promise<string[]> => {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateImages({
      model: IMAGE_GENERATION_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageBytesArray = response.generatedImages
        .map(img => img.image?.imageBytes) // Safely access imageBytes
        .filter((bytes): bytes is string => typeof bytes === 'string'); // Filter out undefined values
      return imageBytesArray;
    }
    return [];
  } catch (error) {
    console.error('Error generating images with Gemini API:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      throw new Error(`Failed to generate image. The provided API key is invalid or has expired.`);
    }
    throw new Error('Failed to generate image. Please check your prompt and API key.');
  }
};