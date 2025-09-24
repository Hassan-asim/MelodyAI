import React from 'react';
import { MusicIcon, SettingsIcon } from './icons';
import { useSettings } from '../hooks/useSettings';

export const Header: React.FC = () => {
  const { openSettings } = useSettings();

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800/50 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF006E] to-[#3A86FF] rounded-lg flex items-center justify-center glow-shadow">
            <MusicIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white font-inter">MelodyAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={openSettings}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};