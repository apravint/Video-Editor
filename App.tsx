import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo, pollVideoOperation, extendVideo, getApiKey, clearApiKey } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { VideoGenerationOptions, ExtendVideoOptions } from './types';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import PromptPresets from './components/PromptPresets';
import ClipHistory, { type ClipItem } from './components/ClipHistory';
import ImageUploader from './components/ImageUploader';
import VideoPlayer from './components/VideoPlayer';
import LoadingIndicator from './components/LoadingIndicator';
import ApiKeySelector from './components/ApiKeySelector';
import { SettingsIcon, RefreshCwIcon, PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A neon hologram of a cat driving at top speed through a futuristic Tokyo rain');
  const [activePrompt, setActivePrompt] = useState<string>('A neon hologram of a cat driving at top speed through a futuristic Tokyo rain');
  const [startImage, setStartImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const resolution = '720p'; // Hardcode for extension compatibility
  
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(() => Boolean(getApiKey()));
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [latestOperation, setLatestOperation] = useState<any | null>(null);
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [extensionPrompt, setExtensionPrompt] = useState<string>('');

  useEffect(() => {
    const checkApiKey = async () => {
      if (getApiKey()) {
        setApiKeySelected(true);
        return;
      }
      if (typeof window !== 'undefined' && (window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setApiKeySelected(Boolean(hasKey));
      }
    };
    checkApiKey();
  }, []);

  const handleResetApiKey = () => {
    clearApiKey();
    setApiKeySelected(false);
  };

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

  const handleAddPresetTag = (tag: string) => {
    setPrompt((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return tag;
      return `${trimmed}, ${tag}`;
    });
  };

  const handleSelectHistoryClip = (clip: ClipItem) => {
    setGeneratedVideoUrl(clip.url);
    setActivePrompt(clip.prompt);
    setIsExtending(false);
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

      const operation = await generateVideo(options);
      setLoadingMessage('AI is crafting your video storyboard...');

      const finalOperation = await pollVideoOperation(operation, (status) => {
        setLoadingMessage(status);
      });
      
      setLatestOperation(finalOperation);

      setLoadingMessage('Fetching your masterpiece...');
      const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
      const key = getApiKey();
      if (downloadLink && key) {
        const response = await fetch(`${downloadLink}&key=${key}`);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setGeneratedVideoUrl(videoUrl);
        setActivePrompt(prompt);

        const newClip: ClipItem = {
          id: `clip-${Date.now()}`,
          url: videoUrl,
          prompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aspectRatio,
        };
        setClips((prev) => [newClip, ...prev]);
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
        errorMessage = "Your API key is invalid or not found. Please re-enter a valid Gemini API key.";
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
          aspectRatio: sourceVideo.aspectRatio || aspectRatio,
        },
      };

      const currentPromptText = extensionPrompt;
      const operation = await extendVideo(options);
      setLoadingMessage('AI is crafting the next scene...');

      const finalOperation = await pollVideoOperation(operation, (status) => {
        setLoadingMessage(status);
      });

      setLatestOperation(finalOperation);
      setExtensionPrompt('');
      
      setLoadingMessage('Fetching your extended masterpiece...');
      const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
      const key = getApiKey();
      if (downloadLink && key) {
        const response = await fetch(`${downloadLink}&key=${key}`);
        if (!response.ok) throw new Error(`Failed to download video: ${response.statusText}`);
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setGeneratedVideoUrl(videoUrl);
        setActivePrompt(currentPromptText);

        const newClip: ClipItem = {
          id: `clip-${Date.now()}`,
          url: videoUrl,
          prompt: `Extended: ${currentPromptText}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aspectRatio: sourceVideo.aspectRatio || aspectRatio,
        };
        setClips((prev) => [newClip, ...prev]);
      } else {
        throw new Error('Video extension completed, but no download link was provided.');
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) errorMessage = err.message;
      if (errorMessage.includes("Requested entity was not found.")) {
        errorMessage = "Your API key is invalid or not found. Please re-enter a valid Gemini API key.";
        setApiKeySelected(false);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [extensionPrompt, latestOperation, aspectRatio]);
  
  if (!apiKeySelected) {
    return <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header hasKey={apiKeySelected} onResetKey={handleResetApiKey} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center max-w-5xl">
        <div className="w-full bg-gray-800/90 border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {isLoading ? (
            <LoadingIndicator message={loadingMessage} />
          ) : generatedVideoUrl ? (
            <>
              <VideoPlayer
                videoUrl={generatedVideoUrl}
                currentPrompt={activePrompt}
                onGenerateNew={handleStartNew}
                onExtend={() => setIsExtending(true)}
              />
              {isExtending && !isLoading && (
                <div className="w-full p-6 md:px-8 md:pb-8 bg-gray-800 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                    What happens next in the story?
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Describe the continuation, new camera move, or subsequent action. Google Veo will extend your scene seamlessly.
                  </p>
                  <textarea
                    rows={3}
                    value={extensionPrompt}
                    onChange={(e) => setExtensionPrompt(e.target.value)}
                    placeholder="e.g., ...and then the camera cranes upward revealing the skyline, as rain starts pouring."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsExtending(false)}
                      className="text-xs text-gray-400 hover:text-gray-200"
                    >
                      Cancel extension
                    </button>
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
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    Create Cinematic Video
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Describe any scene or upload a starting frame to generate with Google Veo.
                  </p>
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Video Settings"
                  className="p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/40 transition-colors"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>

              {showSettings && (
                <div className="grid grid-cols-1 gap-4 mb-6 bg-gray-900/60 p-4 rounded-xl border border-gray-700">
                  <div>
                    <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
                      Aspect Ratio
                    </label>
                    <select
                      id="aspectRatio"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="16:9">16:9 (Landscape - YouTube, Cinema)</option>
                      <option value="9:16">9:16 (Portrait - Shorts, TikTok, Reels)</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Resolution is optimized to 720p for fast rendering and seamless video extension support.
                  </p>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <PromptInput value={prompt} onChange={setPrompt} />
                  <PromptPresets onAddTag={handleAddPresetTag} />
                </div>
                
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  uploadedImage={startImage}
                  onRemoveImage={() => setStartImage(null)}
                />
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-xl text-center">
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:to-pink-700 text-white font-bold rounded-full shadow-lg shadow-purple-900/30 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <RefreshCwIcon className="w-5 h-5 animate-spin" style={{ display: isLoading ? 'block' : 'none' }} />
                  <span>{isLoading ? 'Generating Video...' : 'Generate Scene with Veo'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Clip History Reel */}
          <ClipHistory
            clips={clips}
            activeClipUrl={generatedVideoUrl}
            onSelectClip={handleSelectHistoryClip}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
