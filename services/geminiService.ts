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

const getGeminiAI = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateVideo = async (options: VideoGenerationOptions) => {
    const ai = getGeminiAI();
    // Default model if not specified
    const model = options.model || 'veo-3.1-fast-generate-preview';

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
    // Model must be 'veo-3.1-generate-preview' for extension
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
        await new Promise(resolve => setTimeout(resolve, 10000));
        currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
    }
    
    if (currentOperation.error) {
        throw new Error(`Video generation failed: ${currentOperation.error.message}`);
    }

    return currentOperation;
};
