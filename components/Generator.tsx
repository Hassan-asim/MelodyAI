

import React, { useState } from 'react';
import { generateTrack } from '../services/geminiService';
import type { Track } from '../types';
import { SparklesIcon } from './icons';
import { useSettings } from '../hooks/useSettings';

interface GeneratorProps {
  onGenerationComplete: (track: Track) => void;
  onError: (message: string) => void;
}

const loadingMessages = [
  "Writing the lyrics...",
  "Warming up the synthesizers...",
  "Tuning the virtual instruments...",
  "Composing the digital symphony...",
  "Mixing the audio channels...",
  "Applying the final mastering touches...",
  "Almost there, the track is cooking...",
];

export const Generator: React.FC<GeneratorProps> = ({ onGenerationComplete, onError }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const { apiKey, openSettings } = useSettings();

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    if (!apiKey) {
      onError("Please set your Gemini API key in settings.");
      openSettings();
      return;
    }

    setIsLoading(true);
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 4000);

    try {
      const { mediaUrl, lyrics } = await generateTrack(prompt, apiKey);
      const newTrack: Track = {
        id: new Date().toISOString(),
        prompt: prompt,
        mediaUrl: mediaUrl,
        coverArtUrl: `https://picsum.photos/seed/${new Date().getTime()}/500/500`,
        lyrics: lyrics,
      };
      onGenerationComplete(newTrack);
      setPrompt('');
    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during generation.";
      onError(errorMessage);
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <section className="w-full max-w-3xl text-center my-12">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 font-inter">Create Music From Words</h2>
      <p className="text-lg text-gray-400 mb-8 font-dm-mono">Describe your song, and let AI bring it to life.</p>
      
      <div className="relative w-full">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cinematic space opera theme with a full orchestra..."
          className="w-full h-28 p-4 pr-12 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF006E] focus:border-[#FF006E] transition-all resize-none font-dm-mono"
          disabled={isLoading}
          maxLength={200}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-br from-[#FF006E] to-[#3A86FF] rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform glow-shadow"
        >
          <SparklesIcon className="w-6 h-6" />
        </button>
      </div>

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF006E]"></div>
          <p className="mt-3 text-gray-300 font-dm-mono">{loadingMessage}</p>
        </div>
      )}
    </section>
  );
};