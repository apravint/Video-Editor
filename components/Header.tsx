import React from 'react';
import { VideoIcon, KeyIcon } from './Icons';

interface HeaderProps {
  hasKey?: boolean;
  onResetKey?: () => void;
}

const Header: React.FC<HeaderProps> = ({ hasKey, onResetKey }) => {
  return (
    <header className="bg-gray-850/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-purple-500/30 rounded-xl shadow-inner">
            <VideoIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Gemini Video Studio
              </h1>
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Veo 3.1
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">AI-powered generative video creator & scene extender</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasKey && onResetKey && (
            <button
              onClick={onResetKey}
              title="Change or reset Gemini API Key"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-700 transition-colors"
            >
              <KeyIcon className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Change API Key</span>
            </button>
          )}

          <a
            href="https://github.com/apravint/Video-Editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
