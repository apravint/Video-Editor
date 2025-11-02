// This corresponds to the structure needed for ai.models.generateVideos
export interface VideoGenerationOptions {
  model?: string;
  prompt: string;
  image?: {
    imageBytes: string;
    mimeType: string;
  };
  config: {
    numberOfVideos: number;
    resolution: '720p' | '1080p';
    aspectRatio: '16:9' | '9:16';
  };
}

// New type for extending videos
export interface ExtendVideoOptions {
    model?: string;
    prompt: string;
    video: any; // The video object from a previous operation response
    config: {
      numberOfVideos: number;
      resolution: '720p'; // Must be 720p for extension
      aspectRatio: '16:9' | '9:16';
    };
}
