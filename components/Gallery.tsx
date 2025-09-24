
import React from 'react';
import { TrackCard } from './TrackCard';
import type { Track } from '../types';

interface GalleryProps {
  tracks: Track[];
  onViewDetails: (track: Track) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ tracks, onViewDetails }) => {
  return (
    <section className="w-full max-w-6xl mt-12">
      <h3 className="text-2xl font-bold mb-6 font-inter tracking-tight">Your Creations</h3>
      {tracks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} onViewDetails={() => onViewDetails(track)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
          <div className="text-5xl mb-4">🎵</div>
          <h4 className="text-xl font-bold font-inter">Your gallery is empty</h4>
          <p className="text-gray-400 font-dm-mono mt-2">Create your first track to see it here.</p>
        </div>
      )}
    </section>
  );
};
