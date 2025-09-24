

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Gallery } from './components/Gallery';
import { Player } from './components/Player';
import { Toast } from './components/Toast';
import { SettingsModal } from './components/SettingsModal';
import { TrackDetailModal } from './components/TrackDetailModal';
import { usePlayer } from './hooks/usePlayer';
import type { Track } from './types';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTrackForDetail, setSelectedTrackForDetail] = useState<Track | null>(null);
  // FIX: Destructure `currentTrack` from the `usePlayer` hook to fix a reference error in `handleUpdateTrack`.
  const { currentTrack, setCurrentTrack, setIsPlaying } = usePlayer();

  useEffect(() => {
    try {
      const storedTracks = localStorage.getItem('melody-ai-tracks');
      if (storedTracks) {
        setTracks(JSON.parse(storedTracks));
      } else {
        // Set some example tracks if none are in local storage
        setTracks([
          { id: 'example1', prompt: 'Chill lofi hip-hop beat for studying', mediaUrl: '', coverArtUrl: `https://picsum.photos/seed/example1/500/500`, lyrics: '[Verse 1]\nRainy days and textbooks open\nLofi beat, my focus scopin\'\nMind is calm, the vibes are flowin\'\nYeah, this is how the knowledge gets goin\'', isExample: true },
          { id: 'example2', prompt: 'Energetic 80s synthwave with neon grids', mediaUrl: '', coverArtUrl: `https://picsum.photos/seed/example2/500/500`, lyrics: '[Chorus]\nNeon grids in the midnight hour\nSynthwave dreams, electric power\nRacing through a digital sky\nIn the 80s, we never say die!', isExample: true },
          { id: 'example3', prompt: 'Epic cinematic orchestra for a movie trailer', mediaUrl: '', coverArtUrl: `https://picsum.photos/seed/example3/500/500`, lyrics: '(Epic orchestral swell)\nIn a world of shadow and light,\nA hero rises to the fight.\nDestiny calls, a fate unknown,\nHe will not face it all alone.\n(Full orchestra crescendo)', isExample: true },
        ]);
      }
    } catch (error) {
      console.error("Failed to load tracks from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      const tracksToStore = tracks.filter(t => !t.isExample);
      if (tracksToStore.length > 0) {
        localStorage.setItem('melody-ai-tracks', JSON.stringify(tracksToStore));
      }
    } catch (error) {
      console.error("Failed to save tracks to local storage", error);
    }
  }, [tracks]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerationComplete = (newTrack: Track) => {
    setTracks(prevTracks => [newTrack, ...prevTracks.filter(t => !t.isExample)]);
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  const handleUpdateTrack = (updatedTrack: Track) => {
    setTracks(prevTracks => prevTracks.map(t => t.id === updatedTrack.id ? updatedTrack : t));
    // If the currently playing track is updated, update it in the player as well
    if (setCurrentTrack && updatedTrack.id === currentTrack?.id) {
        setCurrentTrack(updatedTrack);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col text-white font-inter">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <Generator onGenerationComplete={handleGenerationComplete} onError={showToast} />
        <Gallery tracks={tracks} onViewDetails={setSelectedTrackForDetail} />
      </main>
      <Player />
      <SettingsModal />
      {selectedTrackForDetail && (
        <TrackDetailModal 
          track={selectedTrackForDetail}
          onClose={() => setSelectedTrackForDetail(null)}
          onSave={handleUpdateTrack}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;