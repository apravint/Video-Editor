
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-lg font-semibold text-gray-200 mb-2">
        Describe your video
      </label>
      <textarea
        id="prompt"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., A cinematic shot of a majestic eagle soaring over a mountain range at sunrise"
        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};

export default PromptInput;
