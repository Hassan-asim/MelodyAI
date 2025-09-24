
import React, { useState } from 'react';
import type { Track } from '../types';
import { CloseIcon } from './icons';

interface TrackDetailModalProps {
  track: Track;
  onClose: () => void;
  onSave: (track: Track) => void;
}

export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({ track, onClose, onSave }) => {
  const [lyrics, setLyrics] = useState(track.lyrics || '');

  const handleSave = () => {
    onSave({ ...track, lyrics });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl glow-shadow w-full max-w-2xl m-4 relative animate-slide-up flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10" aria-label="Close details">
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div className="w-full md:w-1/3 flex-shrink-0">
            <img src={track.coverArtUrl} alt={track.prompt} className="w-full h-48 md:h-full object-cover"/>
        </div>

        <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-bold mb-2 font-inter line-clamp-2">{track.prompt}</h2>
            <p className="text-sm text-gray-400 mb-4 font-dm-mono">Edit Lyrics</p>
            <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full flex-grow p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF006E] focus:border-[#FF006E] transition-all resize-none font-dm-mono text-sm"
                placeholder="No lyrics available for this track."
            />
            <button
                onClick={handleSave}
                className="w-full mt-4 bg-gradient-to-br from-[#FF006E] to-[#b3004c] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
                Save Lyrics
            </button>
        </div>
      </div>
    </div>
  );
};
