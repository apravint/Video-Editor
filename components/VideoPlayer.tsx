import React, { useState } from 'react';
import { DownloadIcon, PlayIcon, PlusIcon } from './Icons';
import { suggestAudioSoundscape } from '../services/geminiService';

interface VideoPlayerProps {
  videoUrl: string;
  currentPrompt: string;
  onGenerateNew: () => void;
  onExtend: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, currentPrompt, onGenerateNew, onExtend }) => {
  const [soundscape, setSoundscape] = useState<string | null>(null);
  const [isGeneratingSound, setIsGeneratingSound] = useState(false);

  const handleGenerateAudioSuggestion = async () => {
    setIsGeneratingSound(true);
    try {
      const suggestion = await suggestAudioSoundscape(currentPrompt);
      setSoundscape(suggestion);
    } catch (err) {
      console.error(err);
      setSoundscape("Failed to generate sound suggestions.");
    } finally {
      setIsGeneratingSound(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center gap-6 bg-gray-900/50 w-full">
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-black">
        <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
      </div>

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
          <span>🎵 {isGeneratingSound ? "Designing Sound..." : "Suggest Audio Track"}</span>
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
