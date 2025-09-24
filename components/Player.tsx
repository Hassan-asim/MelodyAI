

import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { PlayIcon, PauseIcon, VolumeHighIcon, VolumeMuteIcon, DownloadIcon, DownloadSpinnerIcon } from './icons';

export const Player: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = usePlayer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [playableUrl, setPlayableUrl] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadMedia = async () => {
      if (!currentTrack?.mediaUrl) {
        setPlayableUrl(null);
        return;
      }
      
      setIsLoadingMedia(true);
      setPlayableUrl(null);

      try {
        const response = await fetch(currentTrack.mediaUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch media: ${response.statusText}`);
        }
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPlayableUrl(objectUrl);
      } catch (error) {
        console.error("Error loading media for playback:", error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    loadMedia();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack]);
  
  useEffect(() => {
    if (videoRef.current && playableUrl) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, playableUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
      if (progressRef.current) {
        const value = (videoRef.current.currentTime / videoRef.current.duration) * 100 || 0;
        progressRef.current.value = String(value);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if(newVolume > 0) setIsMuted(false);
  };
  
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleDownload = async () => {
    if (!currentTrack || !currentTrack.mediaUrl) return;
    setIsDownloading(true);
    try {
        const response = await fetch(currentTrack.mediaUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${currentTrack.prompt.slice(0, 30).replace(/\s/g, '_')}.m4a`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error("Download failed:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-700/50 p-4 mx-auto max-w-7xl mb-4 rounded-xl shadow-2xl glow-shadow">
        <video
          ref={videoRef}
          src={playableUrl || ''}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        <div className="flex items-center space-x-4">
          <img src={currentTrack.coverArtUrl} alt={currentTrack.prompt} className="w-14 h-14 rounded-md object-cover" />
          
          <div className="flex-grow flex flex-col justify-center min-w-0">
            <p className="font-bold truncate">{currentTrack.prompt}</p>
            <p className="text-sm text-gray-400 font-dm-mono">MelodyAI Generated</p>
          </div>
          
          <div className="flex-grow flex items-center space-x-4 max-w-lg hidden md:flex">
             <span className="text-xs font-dm-mono text-gray-400 w-10 text-right">{formatTime(progress)}</span>
             <input
                type="range"
                ref={progressRef}
                defaultValue="0"
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF006E]"
            />
            <span className="text-xs font-dm-mono text-gray-400 w-10">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={togglePlayPause} disabled={isLoadingMedia} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-wait">
              {isLoadingMedia ? <DownloadSpinnerIcon className="w-5 h-5" /> : (isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />)}
            </button>
            <div className="flex items-center space-x-2 group">
              <button onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeMuteIcon className="w-6 h-6 text-gray-400" /> : <VolumeHighIcon className="w-6 h-6 text-gray-400" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white transition-opacity opacity-0 group-hover:opacity-100 hidden lg:block"
              />
            </div>
             <button onClick={handleDownload} disabled={isDownloading} className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-wait">
                {isDownloading ? <DownloadSpinnerIcon className="w-6 h-6" /> : <DownloadIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
