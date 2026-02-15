
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import { VaultFile } from '../../types';

interface VideoPlayerProps {
  file: VaultFile;
  playlist: VaultFile[];
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ file, playlist, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFile, setCurrentFile] = useState(file);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [currentFile]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (amount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = playlist.findIndex(f => f.id === currentFile.id);
    if (idx < playlist.length - 1) setCurrentFile(playlist[idx + 1]);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = playlist.findIndex(f => f.id === currentFile.id);
    if (idx > 0) setCurrentFile(playlist[idx - 1]);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="w-full max-w-5xl flex flex-col items-center justify-center relative group overflow-hidden rounded-3xl bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
    >
      <video 
        ref={videoRef}
        src={currentFile.data}
        className="w-full max-h-[70vh] object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {/* Overlay Play/Pause Big Icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/20 animate-pulse">
            <Play size={64} className="text-white fill-white ml-2" />
          </div>
        </div>
      )}

      {/* Premium Controls Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 flex flex-col gap-4 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Slider */}
        <div className="group/slider relative flex items-center w-full">
          <input 
            type="range" 
            min="0"
            max="100"
            step="0.1"
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
            value={progress}
            onChange={seek}
            style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <button onClick={prev} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90">
                <SkipBack size={24} />
              </button>
              <button onClick={(e) => skip(-10, e)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90" title="Back 10s">
                <RotateCcw size={24} />
              </button>
            </div>

            <button 
              onClick={togglePlay} 
              className="bg-white text-black p-4 rounded-full hover:scale-110 transition-all transform active:scale-95 shadow-xl"
            >
              {isPlaying ? <Pause size={28} className="fill-black" /> : <Play size={28} className="ml-1 fill-black" />}
            </button>

            <div className="flex items-center gap-2">
              <button onClick={(e) => skip(10, e)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90" title="Forward 10s">
                <RotateCw size={24} />
              </button>
              <button onClick={next} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90">
                <SkipForward size={24} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-white/60 font-mono text-sm">
              <span className="text-white font-bold">{formatTime(videoRef.current?.currentTime || 0)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleMute} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <Maximize2 size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
