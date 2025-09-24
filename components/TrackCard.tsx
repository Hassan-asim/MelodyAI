
import React from 'react';
import type { Track } from '../types';
import { usePlayer } from '../hooks/usePlayer';
import { PlayIcon, LyricsIcon } from './icons';

interface TrackCardProps {
  track: Track;
  onViewDetails: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onViewDetails }) => {
  const { setCurrentTrack, setIsPlaying, currentTrack, isPlaying } = usePlayer();
  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    if (track.isExample) return;
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleViewDetails = () => {
    if (track.isExample) return; // Or show static lyrics for examples
    onViewDetails();
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 transition-all hover:glow-shadow-secondary" onClick={handleViewDetails}>
      <img
        src={track.coverArtUrl}
        alt={track.prompt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 transition-opacity opacity-0 group-hover:opacity-100 flex flex-col justify-between p-4 cursor-pointer">
        <p className="text-sm font-dm-mono text-gray-200 line-clamp-3">{track.prompt}</p>
        {!track.isExample && (
          <div className="self-end mt-auto flex items-center space-x-2">
            <button
                onClick={onViewDetails}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="View lyrics"
            >
                <LyricsIcon className="w-5 h-5 text-white" />
            </button>
            <button
            onClick={handlePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCurrentlyPlaying ? 'bg-transparent' : 'bg-[#3A86FF]/80 backdrop-blur-sm hover:bg-[#3A86FF]'}`}
            aria-label="Play track"
            >
            {isCurrentlyPlaying ? (
                <div className="w-8 h-8 flex justify-around items-end">
                    <div className="w-2 h-full bg-white animate-[wave_1.2s_ease-in-out_infinite] [animation-delay:-0.4s]"></div>
                    <div className="w-2 h-full bg-white animate-[wave_1.2s_ease-in-out_infinite] [animation-delay:-0.2s]"></div>
                    <div className="w-2 h-full bg-white animate-[wave_1.2s_ease-in-out_infinite]"></div>
                </div>
            ) : (
                <PlayIcon className="w-6 h-6 text-white" />
            )}
            </button>
          </div>
        )}
      </div>
      {track.isExample && (
        <div className="absolute top-2 right-2 bg-[#FF006E] text-white text-xs font-bold px-2 py-1 rounded font-dm-mono">
            EXAMPLE
        </div>
      )}
    </div>
  );
};
