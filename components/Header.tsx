import React from 'react';
import { VideoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <VideoIcon className="w-8 h-8 mr-3 text-purple-400" />
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Gemini Video Editor
        </h1>
      </div>
    </header>
  );
};

export default Header;
