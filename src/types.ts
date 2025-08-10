
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export type GenerationMode = "pixel" | "stickfigure" | "real" | "custom";

export interface Prompt {
  id: number;
  text: string;
  count: number;
}

export interface GeneratedImage {
  id: number;
  src: string;
  prompt: string;
  promptIndex?: number;
}
