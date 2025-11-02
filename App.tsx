import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo, pollVideoOperation, extendVideo } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { VideoGenerationOptions, ExtendVideoOptions } from './types';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageUploader from './components/ImageUploader';
import VideoPlayer from './components/VideoPlayer';
import LoadingIndicator from './components/LoadingIndicator';
import ApiKeySelector from './components/ApiKeySelector';
import { SettingsIcon, RefreshCwIcon, PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A neon hologram of a cat driving at top speed');
  const [startImage, setStartImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const resolution = '720p'; // Hardcode for extension compatibility
  
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [latestOperation, setLatestOperation] = useState<any | null>(null);
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [extensionPrompt, setExtensionPrompt] = useState<string>('');


  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setStartImage({ base64, mimeType: file.type });
      setError(null);
    } catch (err) {
      setError('Failed to process image. Please try another file.');
      console.error(err);
    }
  };

  const handleStartNew = () => {
    setGeneratedVideoUrl(null);
    setError(null);
    setStartImage(null);
    setLatestOperation(null);
    setIsExtending(false);
    setExtensionPrompt('');
  };
  
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() && !startImage) {
      setError('Please provide a prompt or a starting image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setLoadingMessage('Initializing video generation...');

    try {
      const options: VideoGenerationOptions = {
        prompt,
        image: startImage ? { imageBytes: startImage.base64, mimeType: startImage.mimeType } : undefined,
        config: {
          numberOfVideos: 1,
          resolution,
          aspectRatio,
        },
        model: 'veo-3.1-generate-preview',
      };

      let operation = await generateVideo(options);
      setLoadingMessage('AI is crafting your video storyboard...');

      const finalOperation = await pollVideoOperation(operation, (status) => {
         setLoadingMessage(status);
      });
      
      setLatestOperation(finalOperation);

      setLoadingMessage('Fetching your masterpiece...');
      const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink && process.env.API_KEY) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setGeneratedVideoUrl(videoUrl);
      } else {
        throw new Error('Video generation completed, but no download link was provided.');
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (errorMessage.includes("Requested entity was not found.")) {
        errorMessage = "Your API key is invalid or not found. Please select a valid key.";
        setApiKeySelected(false);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, startImage, aspectRatio]);

  const handleExtend = useCallback(async () => {
    if (!extensionPrompt.trim()) {
      setError('Please describe what should happen next.');
      return;
    }
    if (!latestOperation?.response?.generatedVideos?.[0]?.video) {
        setError('Could not find the source video to extend. Please start a new video.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setIsExtending(false);
    setGeneratedVideoUrl(null);
    setLoadingMessage('Initializing video extension...');

    try {
      const sourceVideo = latestOperation.response.generatedVideos[0].video;

      const options: ExtendVideoOptions = {
        prompt: extensionPrompt,
        video: sourceVideo,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: sourceVideo.aspectRatio,
        },
      };

      let operation = await extendVideo(options);
      setLoadingMessage('AI is crafting the next scene...');

      const finalOperation = await pollVideoOperation(operation, (status) => {
         setLoadingMessage(status);
      });

      setLatestOperation(finalOperation);
      setExtensionPrompt('');
      
      setLoadingMessage('Fetching your extended masterpiece...');
      const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink && process.env.API_KEY) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error(`Failed to download video: ${response.statusText}`);
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setGeneratedVideoUrl(videoUrl);
      } else {
        throw new Error('Video extension completed, but no download link was provided.');
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) errorMessage = err.message;
      if (errorMessage.includes("Requested entity was not found.")) {
        errorMessage = "Your API key is invalid or not found. Please select a valid key.";
        setApiKeySelected(false);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [extensionPrompt, latestOperation]);
  
  if (!apiKeySelected) {
    return <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {isLoading ? (
            <LoadingIndicator message={loadingMessage} />
          ) : generatedVideoUrl ? (
            <>
              <VideoPlayer videoUrl={generatedVideoUrl} onGenerateNew={handleStartNew} onExtend={() => setIsExtending(true)} />
              {isExtending && !isLoading && (
                <div className="w-full p-6 md:px-8 md:pb-8 bg-gray-800 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    What happens next?
                  </h3>
                  <textarea
                    rows={3}
                    value={extensionPrompt}
                    onChange={(e) => setExtensionPrompt(e.target.value)}
                    placeholder="e.g., ...and then a friendly alien appears offering a space taco."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                   <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleExtend}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      <PlusIcon className="w-5 h-5" />
                      <span>Generate Extension</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Start Your Story
                </h2>
                <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition-colors">
                  <SettingsIcon className="w-6 h-6" />
                </button>
              </div>

              {showSettings && (
                <div className="grid grid-cols-1 gap-6 mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div>
                    <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                    <select
                      id="aspectRatio"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Portrait)</option>
                    </select>
                  </div>
                   <p className="text-xs text-gray-500 text-center">
                      Resolution is set to 720p for compatibility with the video extension feature.
                    </p>
                </div>
              )}
              
              <div className="space-y-6">
                <PromptInput value={prompt} onChange={setPrompt} />
                <ImageUploader onImageUpload={handleImageUpload} uploadedImage={startImage} onRemoveImage={() => setStartImage(null)} />
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <RefreshCwIcon className="w-5 h-5 animate-spin" style={{ display: isLoading ? 'block' : 'none' }} />
                  <span>{isLoading ? 'Generating...' : 'Generate Video'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
