
import React, { useState } from 'react';
import { KeyIcon, AlertTriangleIcon } from './Icons';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const [isOpening, setIsOpening] = useState(false);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            setIsOpening(true);
            try {
                await window.aistudio.openSelectKey();
                // Assume success and let the parent component re-check.
                onKeySelected();
            } catch (error) {
                console.error("Error opening API key selection:", error);
            } finally {
                setIsOpening(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                <KeyIcon className="mx-auto h-12 w-12 text-purple-400" />
                <h2 className="mt-6 text-2xl font-bold">API Key Required</h2>
                <p className="mt-2 text-gray-400">
                    To use the video generation features, you must select an API key. This is a mandatory step.
                </p>
                
                <div className="mt-6 p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg text-left text-sm flex gap-3">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        Video generation is an advanced feature and may incur costs. Please review the 
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-200 hover:underline ml-1">
                            billing documentation
                        </a> for details.
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSelectKey}
                        disabled={isOpening}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isOpening ? 'Opening Dialog...' : 'Select API Key'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySelector;
