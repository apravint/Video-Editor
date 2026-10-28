import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { DownloadIcon, PlayIcon, PlusIcon } from './Icons';
import { suggestAudioSoundscape } from '../services/geminiService';
import { RemotionOverlayComposition } from './RemotionOverlayComposition';

interface VideoPlayerProps {
  videoUrl: string;
  currentPrompt: string;
  onGenerateNew: () => void;
  onExtend: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  currentPrompt,
  onGenerateNew,
  onExtend,
}) => {
  const [playerMode, setPlayerMode] = useState<'raw' | 'remotion'>('remotion');
  const [soundscape, setSoundscape] = useState<string | null>(null);
  const [isGeneratingSound, setIsGeneratingSound] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Remotion Parametric Overlay State
  const defaultTitle = currentPrompt
    ? currentPrompt.slice(0, 32).trim() + (currentPrompt.length > 32 ? '...' : '')
    : 'Cinematic Vision';
  const [overlayTitle, setOverlayTitle] = useState<string>(defaultTitle);
  const [overlaySubtitle, setOverlaySubtitle] = useState<string>(
    currentPrompt || 'Generative Scene directed by Gemini & Veo'
  );
  const [overlayTheme, setOverlayTheme] = useState<'cinematic' | 'cyberpunk' | 'minimal' | 'neon'>('cinematic');
  const [overlayPosition, setOverlayPosition] = useState<'lower-third' | 'center' | 'top-banner'>('lower-third');
  const [showProgressBar, setShowProgressBar] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);

  const handleGenerateAudioSuggestion = async () => {
    setIsGeneratingSound(true);
    try {
      const suggestion = await suggestAudioSoundscape(currentPrompt);
      setSoundscape(suggestion);
    } catch (err) {
      console.error(err);
      setSoundscape('Failed to generate sound suggestions.');
    } finally {
      setIsGeneratingSound(false);
    }
  };

  const handleCopyRemotionCode = () => {
    const codeSnippet = `import { Composition } from 'remotion';
import { RemotionOverlayComposition } from './RemotionOverlayComposition';

export const RemotionVideo = () => {
  return (
    <Composition
      id="VeoSceneWithRemotionOverlay"
      component={RemotionOverlayComposition}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        videoUrl: "${videoUrl}",
        title: "${overlayTitle.replace(/"/g, '\\"')}",
        subtitle: "${overlaySubtitle.replace(/"/g, '\\"')}",
        theme: "${overlayTheme}",
        position: "${overlayPosition}",
        showProgressBar: ${showProgressBar},
        showWatermark: ${showWatermark},
      }}
    />
  );
};`;
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center gap-6 bg-gray-900/60 w-full rounded-2xl border border-gray-800">
      {/* Player Mode Switcher Bar */}
      <div className="flex items-center justify-between w-full max-w-4xl border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">View Mode:</span>
          <div className="inline-flex rounded-lg bg-gray-800 p-1 border border-gray-700">
            <button
              onClick={() => setPlayerMode('raw')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                playerMode === 'raw'
                  ? 'bg-gray-700 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📹 Raw Video
            </button>
            <button
              onClick={() => setPlayerMode('remotion')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                playerMode === 'remotion'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>⚡ Remotion Studio Player</span>
              <span className="bg-blue-400/20 text-blue-300 text-[10px] px-1.5 py-0.2 rounded-full border border-blue-400/30">
                React Code
              </span>
            </button>
          </div>
        </div>

        {playerMode === 'remotion' && (
          <button
            onClick={handleCopyRemotionCode}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/80 transition-all flex items-center gap-1.5"
            title="Copy standalone Remotion composition code for CLI or project reuse"
          >
            <span>{copiedCode ? '✓ Copied Remotion JSX!' : '📋 Export Remotion Code'}</span>
          </button>
        )}
      </div>

      {/* Main Video Viewport */}
      <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700/80 bg-black relative">
        {playerMode === 'raw' ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          />
        ) : (
          <Player
            component={RemotionOverlayComposition}
            inputProps={{
              videoUrl: videoUrl,
              title: overlayTitle,
              subtitle: overlaySubtitle,
              theme: overlayTheme,
              position: overlayPosition,
              showProgressBar: showProgressBar,
              showWatermark: showWatermark,
            }}
            durationInFrames={150}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls
            autoPlay
            loop
          />
        )}
      </div>

      {/* Remotion Overlay Customizer Panel */}
      {playerMode === 'remotion' && (
        <div className="w-full max-w-4xl p-5 bg-gray-800/80 border border-indigo-500/30 rounded-xl space-y-4 text-left shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 text-lg">⚡</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Remotion Parametric Overlay Controls
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Live React Props & Keyframe Springs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Animated Title Card:
              </label>
              <input
                type="text"
                value={overlayTitle}
                onChange={(e) => setOverlayTitle(e.target.value)}
                placeholder="Enter title text..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Subtitle / Description:
              </label>
              <input
                type="text"
                value={overlaySubtitle}
                onChange={(e) => setOverlaySubtitle(e.target.value)}
                placeholder="Enter subtitle or tagline..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Style & Position Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Visual Theme:
              </label>
              <select
                value={overlayTheme}
                onChange={(e) => setOverlayTheme(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="cinematic">👑 Cinematic Gold</option>
                <option value="cyberpunk">🌆 Cyberpunk Neon</option>
                <option value="neon">🔮 Electric Violet</option>
                <option value="minimal">⚡ Sleek Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Overlay Position:
              </label>
              <select
                value={overlayPosition}
                onChange={(e) => setOverlayPosition(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="lower-third">Lower Third</option>
                <option value="center">Centered Intro Card</option>
                <option value="top-banner">Top Banner</option>
              </select>
            </div>

            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProgressBar}
                  onChange={(e) => setShowProgressBar(e.target.checked)}
                  className="rounded text-indigo-500 focus:ring-0 bg-gray-900 border-gray-700"
                />
                <span>Animated Timeline Progress Bar</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-indigo-500 focus:ring-0 bg-gray-900 border-gray-700"
                />
                <span>Show Remotion Badge</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 w-full justify-center">
        <button
          onClick={onExtend}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Extend Scene</span>
        </button>

        <a
          href={videoUrl}
          download={`veo-video-${Date.now()}.mp4`}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full shadow-md transform hover:scale-105 transition-all text-sm"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Download MP4</span>
        </a>

        <button
          onClick={handleGenerateAudioSuggestion}
          disabled={isGeneratingSound}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 font-medium rounded-full shadow-md transition-all text-sm disabled:opacity-50"
        >
          <span>🎵 {isGeneratingSound ? 'Designing Sound...' : 'Suggest Audio Track'}</span>
        </button>

        <button
          onClick={onGenerateNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-full border border-gray-700 shadow-md transition-all text-sm"
        >
          <PlayIcon className="w-4 h-4" />
          <span>New Video</span>
        </button>
      </div>

      {/* Audio Soundscape Suggestion Drawer */}
      {soundscape && (
        <div className="w-full max-w-2xl p-4 bg-gray-800/90 border border-purple-500/30 rounded-xl text-left space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <span>🎧 AI Soundscape & Music Suggestion</span>
            </h4>
            <button
              onClick={() => setSoundscape(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line bg-gray-900/70 p-3 rounded-lg border border-gray-700/50">
            {soundscape}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
