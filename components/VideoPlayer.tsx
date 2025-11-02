import React from 'react';
import { DownloadIcon, PlayIcon, PlusIcon } from './Icons';

interface VideoPlayerProps {
  videoUrl: string;
  onGenerateNew: () => void;
  onExtend: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onGenerateNew, onExtend }) => {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center gap-6 bg-gray-900/50 w-full">
      <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <video src={videoUrl} controls autoPlay loop className="w-full h-full bg-black" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
         <button
          onClick={onExtend}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Extend This Video</span>
        </button>
        <a
          href={videoUrl}
          download="gemini-video.mp4"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download</span>
        </a>
        <button
          onClick={onGenerateNew}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <PlayIcon className="w-5 h-5" />
          <span>Start New</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
