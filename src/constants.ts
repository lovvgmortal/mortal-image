import type { AspectRatio, GenerationMode } from './types';

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const GENERATION_MODES: { value: GenerationMode; label:string }[] = [
  { value: 'pixel', label: 'Pixel Art' },
  { value: 'stickfigure', label: 'Stick Figure' },
  { value: 'real', label: 'Realistic' },
  { value: 'custom', label: 'Custom' },
];

export const STYLE_PREFIXES: Record<GenerationMode, string> = {
    pixel: 'pixel art style, 8-bit, vibrant colors',
    stickfigure: 'simple stick figure drawing, black on white background, minimalist',
    real: 'ultra realistic photograph, 8k, sharp focus',
    custom: '',
};

export const IMAGE_GENERATION_MODEL = 'imagen-3.0-generate-002';
// export const IMAGE_GENERATION_MODEL = 'gemini-2.0-flash-preview-image-generation'
export const GENERATION_DELAY_MS = 3000;
export const API_KEYS_STORAGE_KEY = 'gemini-pixel-api-keys-v1';