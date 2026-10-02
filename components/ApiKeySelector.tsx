import React, { useState } from 'react';
import { KeyIcon, AlertTriangleIcon } from './Icons';
import { setApiKey } from '../services/geminiService';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [manualKey, setManualKey] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAiStudioAvailable = typeof window !== 'undefined' && 
    window.aistudio && 
    typeof window.aistudio.openSelectKey === 'function';

  const handleSelectAiStudioKey = async () => {
    if (isAiStudioAvailable) {
      setIsOpening(true);
      try {
        await window.aistudio.openSelectKey();
        onKeySelected();
      } catch (err: any) {
        console.error("Error opening AI Studio key selection:", err);
        setError("Failed to open AI Studio dialog: " + (err.message || 'Unknown'));
      } finally {
        setIsOpening(false);
      }
    }
  };

  const handleSaveManualKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKey.trim()) {
      setError("Please enter a valid Gemini API key.");
      return;
    }
    setApiKey(manualKey.trim());
    onKeySelected();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-purple-900/40 rounded-full flex items-center justify-center border border-purple-500/30">
          <KeyIcon className="h-8 w-8 text-purple-400" />
        </div>
        
        <h2 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Gemini API Key Required
        </h2>
        <p className="mt-2 text-gray-400 text-sm">
          To generate and extend videos using <b>Google Veo</b>, you need a Gemini API Key.
        </p>

        {/* Manual Key Input for Local & Self-Hosted Users */}
        <form onSubmit={handleSaveManualKey} className="mt-6 text-left space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Enter API Key
            </label>
            <input
              type="password"
              value={manualKey}
              onChange={(e) => {
                setManualKey(e.target.value);
                setError(null);
              }}
              placeholder="AIzaSy..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.01]"
          >
            Save & Continue
          </button>
        </form>

        {isAiStudioAvailable && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={handleSelectAiStudioKey}
              disabled={isOpening}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg text-sm transition-colors"
            >
              {isOpening ? 'Opening Dialog...' : 'Select from Google AI Studio'}
            </button>
          </div>
        )}

        <div className="mt-6 p-3.5 bg-yellow-900/30 border border-yellow-700/50 text-yellow-200 rounded-lg text-left text-xs flex gap-2.5">
          <AlertTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400" />
          <div>
            Don't have a key? Get one for free at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-yellow-300 hover:text-white"
            >
              Google AI Studio
            </a>
            . Video generation runs with Google Veo.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelector;
