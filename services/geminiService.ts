import { GoogleGenAI } from '@google/genai';
import type { VideoGenerationOptions, ExtendVideoOptions } from '../types';

// These messages provide a better user experience during the wait time
const loadingMessages = [
  "Warming up the AI engine...",
  "Gathering creative inspiration...",
  "Scripting the next scene...",
  "Casting digital actors...",
  "Setting up virtual cameras...",
  "Rendering extension frames...",
  "Compositing video layers...",
  "Applying new special effects...",
  "Color grading the footage...",
  "Mixing the audio soundscape...",
  "Stitching clips together...",
  "Preparing for the next act...",
];

export const getApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey && storedKey.trim()) {
      return storedKey.trim();
    }
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_KEY || process.env.GEMINI_API_KEY || null;
  }
  return null;
};

export const setApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('GEMINI_API_KEY', key.trim());
  }
};

export const clearApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('GEMINI_API_KEY');
  }
};

const getGeminiAI = () => {
  const key = getApiKey();
  if (!key) {
    throw new Error("Gemini API key not found. Please provide an API key in settings or .env.local");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateVideo = async (options: VideoGenerationOptions) => {
  const ai = getGeminiAI();
  const model = options.model || 'veo-3.1-generate-preview';

  const operation = await ai.models.generateVideos({
    model,
    prompt: options.prompt,
    image: options.image,
    config: options.config,
  });
  return operation;
};

export const extendVideo = async (options: ExtendVideoOptions) => {
  const ai = getGeminiAI();
  const model = 'veo-3.1-generate-preview';

  const operation = await ai.models.generateVideos({
    model,
    prompt: options.prompt,
    video: options.video,
    config: options.config,
  });
  return operation;
};

export const pollVideoOperation = async (operation: any, onProgress: (message: string) => void) => {
  const ai = getGeminiAI();
  let currentOperation = operation;
  let messageIndex = 0;

  while (!currentOperation.done) {
    onProgress(loadingMessages[messageIndex % loadingMessages.length]);
    messageIndex++;
    await new Promise(resolve => setTimeout(resolve, 8000));
    currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
  }

  if (currentOperation.error) {
    throw new Error(`Video generation failed: ${currentOperation.error.message}`);
  }

  return currentOperation;
};

export const suggestAudioSoundscape = async (videoPrompt: string): Promise<string> => {
  try {
    const ai = getGeminiAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Hollywood sound designer and composer. Given this video scene prompt: "${videoPrompt}", provide in 2-3 concise sentences: 
1. Musical Score (tempo, instruments, genre, mood)
2. Ambient Background Soundscape
3. Key Foley sound effects.
Keep it punchy and ready to copy into an AI music/sound generator.`,
    });
    return response.text || "No suggestion generated.";
  } catch (err: any) {
    console.error("Failed to generate audio suggestions:", err);
    return "Could not generate soundscape suggestion: " + (err.message || "Unknown error");
  }
};
