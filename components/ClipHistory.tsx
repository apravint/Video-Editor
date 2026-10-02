import React from 'react';
import { DownloadIcon, PlayIcon } from './Icons';

export interface ClipItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
  aspectRatio: string;
}

interface ClipHistoryProps {
  clips: ClipItem[];
  activeClipUrl: string | null;
  onSelectClip: (clip: ClipItem) => void;
}

const ClipHistory: React.FC<ClipHistoryProps> = ({ clips, activeClipUrl, onSelectClip }) => {
  if (clips.length === 0) return null;

  return (
    <div className="w-full p-4 md:p-6 bg-gray-800/80 border-t border-gray-700/80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <span>🎬 Session Video Reel & History</span>
          <span className="text-xs bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
            {clips.length} {clips.length === 1 ? 'clip' : 'clips'}
          </span>
        </h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600">
        {clips.map((clip, index) => {
          const isActive = clip.url === activeClipUrl;
          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip)}
              className={`flex-shrink-0 w-56 p-2 rounded-xl border cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-blue-900/30 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-gray-900/60 border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-2">
                <video src={clip.url} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors flex items-center justify-center">
                  <PlayIcon className="w-6 h-6 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-gray-300">
                  {clip.aspectRatio}
                </span>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2 font-medium mb-1" title={clip.prompt}>
                {index + 1}. {clip.prompt}
              </p>
              
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-800">
                <span>{clip.timestamp}</span>
                <a
                  href={clip.url}
                  download={`veo-clip-${index + 1}.mp4`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-blue-400 flex items-center gap-1"
                  title="Download MP4"
                >
                  <DownloadIcon className="w-3 h-3" />
                  <span>Save</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClipHistory;
