
import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Heart } from 'lucide-react';

const AudioControls = ({ track }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Helper to format time
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Check if track is liked on mount/change
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const res = await axios.get('/api/profile', {
          headers: { 'x-auth-token': token }
        });
        
        const favorites = res.data.favorites || [];
        const trackId = track.trackId || track.id;
        const found = favorites.some(f => f.trackId === trackId);
        setIsLiked(found);
      } catch (err) {
        console.error("Error checking like status", err);
      }
    };
    if (track) checkLikeStatus();
  }, [track]);

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = { headers: { 'x-auth-token': token } };
      const trackId = track.trackId || track.id;

      if (isLiked) {
        await axios.delete(`/api/profile/favorites/${trackId}`, config);
        setIsLiked(false);
      } else {
        await axios.put('/api/profile/favorites', {
          trackId: trackId,
          title: track.title,
          artist: track.artist,
          albumArt: track.albumArt,
          previewUrl: track.previewUrl || track.audioUrl
        }, config);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  // Toggle Play/Pause Logic
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error("Play failed:", e));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Handle Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  // Handle Audio Source Setup
  useEffect(() => {
    const setupAudio = async () => {
      if (track && (track.trackId || track.id)) {
        try {
          const resolvedTrackId = track.trackId || track.id;
          let audioSrc = track.previewUrl || track.audioUrl || '';

          const token = localStorage.getItem('token');
          const authConfig = token ? { headers: { 'x-auth-token': token } } : {};

          if (!audioSrc && token) {
            try {
              const res = await axios.get(`/api/stream/${resolvedTrackId}`, authConfig);
              audioSrc = res.data.previewUrl;
            } catch (e) {
              console.error("Stream fetch failed", e);
            }
          }

          if (audioRef.current && audioSrc) {
            if (audioRef.current.src !== audioSrc) {
              audioRef.current.src = audioSrc;
              audioRef.current.volume = volume;
              setIsPlaying(false);
              setProgress(0);
              setCurrentTime(0);
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.warn("Auto-play blocked", e));
            }
          }
        } catch (error) {
          console.error('Error setting up audio:', error);
        }
      }
    };
    setupAudio();
  }, [track]);

  // Update Time & Progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 0;
      setCurrentTime(current);
      setDuration(dur);
      setProgress(dur > 0 ? (current / dur) * 100 : 0);
    }
  };

  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current && duration > 0) {
      const bar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const barWidth = bar.clientWidth;
      const newTime = (clickPosition / barWidth) * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / duration) * 100);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioRef.current.muted = newMuteState;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none"
      >
        <div className="glass-card max-w-screen-xl mx-auto flex items-center justify-between p-4 relative overflow-hidden group pointer-events-auto">
          
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-purple-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleMetadataLoaded}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4 z-10 w-1/3">
            <motion.div className="relative shrink-0" whileHover={{ scale: 1.05 }}>
              {track.albumArt ? (
                <img src={track.albumArt} alt="Album Art" className={`w-14 h-14 rounded-lg object-cover shadow-lg border border-white/10 ${isPlaying ? 'animate-pulse' : ''}`} />
              ) : (
                <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center"><Volume2 className="text-white/50" /></div>
              )}
            </motion.div>
            
            <div className="overflow-hidden min-w-0">
              <h4 className="text-white font-bold truncate text-sm md:text-base cursor-default hover:text-primary transition-colors">
                {track.title || "Unknown Title"}
              </h4>
              <p className="text-gray-400 text-xs md:text-sm truncate hover:text-white transition-colors">
                {track.artist || "Unknown Artist"}
              </p>
            </div>
            
            <button 
              onClick={toggleLike}
              className={`hidden sm:block transition-colors ml-2 shrink-0 ${isLiked ? 'text-primary fill-primary' : 'text-gray-400 hover:text-white'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-primary' : ''}`} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center w-1/3 z-10 gap-2">
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-white transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
              <motion.button onClick={togglePlayPause} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className="bg-white text-black rounded-full p-2 hover:bg-primary transition-colors shadow-lg shadow-primary/20">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </motion.button>
              <button className="text-gray-400 hover:text-white transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
            </div>
            <div className="w-full max-w-md flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <div className="h-1.5 bg-white/10 rounded-full flex-grow relative overflow-hidden group/bar cursor-pointer hover:h-2 transition-all" onClick={handleSeek}>
                <motion.div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${progress}%` }} layoutId="progress" />
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
              <span className="w-10">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end w-1/3 z-10 gap-3">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="w-24 group/vol relative h-1.5 bg-white/10 rounded-full cursor-pointer hover:h-2 transition-all">
              <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="absolute top-0 left-0 h-full bg-white rounded-full transition-all group-hover/vol:bg-primary" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioControls;