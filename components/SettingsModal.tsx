import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { CloseIcon } from './icons';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, closeSettings, apiKey, setApiKey } = useSettings();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');

  useEffect(() => {
    setLocalApiKey(apiKey || '');
  }, [apiKey, isSettingsOpen]);

  if (!isSettingsOpen) {
    return null;
  }

  const handleSave = () => {
    setApiKey(localApiKey);
    closeSettings();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in" onClick={closeSettings} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl glow-shadow-secondary w-full max-w-md m-4 p-6 relative animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeSettings} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close settings">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 id="settings-title" className="text-2xl font-bold mb-4 font-inter">Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2 font-dm-mono">
              Gemini API Key
            </label>
            <input
              type="password"
              id="api-key"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key"
              className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] transition-all font-dm-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              Your API key is stored only in your browser's local storage.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-br from-[#3A86FF] to-[#0048B3] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};