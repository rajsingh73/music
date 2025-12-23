
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2, Search } from 'lucide-react';
import TrackSuggestion from './TrackSuggestion';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tracks: [],
  });
  const [currentTrackSearch, setCurrentTrackSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Escape Key to Close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/dashboard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.trackToAdd) {
      const { trackToAdd } = location.state;
      
      setFormData((prev) => {
        // DUPLICATION CHECK
        const trackIdToAdd = trackToAdd.trackId || trackToAdd.id;
        const exists = prev.tracks.some(t => (t.trackId || t.id) === trackIdToAdd);
        
        if (exists) return prev; // If exists, do nothing

        return {
          ...prev,
          tracks: [...prev.tracks, {
            trackId: trackIdToAdd,
            title: trackToAdd.title,
            artist: trackToAdd.artist,
            albumArt: trackToAdd.albumArt
          }]
        };
      });
      
      // Clear state so it doesn't re-add on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleTrackSelect = (track) => {
    const trackIdToAdd = track.trackId || track.id;
    
    setFormData((prev) => {
      if (prev.tracks.some(t => (t.trackId || t.id) === trackIdToAdd)) {
        return prev;
      }
      return {
        ...prev,
        tracks: [...prev.tracks, {
          trackId: trackIdToAdd,
          title: track.title,
          artist: track.artist,
          albumArt: track.albumArt
        }]
      }
    });
    setCurrentTrackSearch('');
  };

  const removeTrack = (index) => {
    const newTracks = formData.tracks.filter((_, i) => i !== index);
    setFormData({ ...formData, tracks: newTracks });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/playlists', formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to create playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-[60]">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" 
        onClick={() => navigate('/dashboard')}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Plus className="w-8 h-8 text-primary" /> Create Playlist
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="My Awesome Mix"
                className="glass-input"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Vibes for the weekend..."
                className="glass-input min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="border-t border-white/10 my-6" />

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" /> Add Tracks
            </label>
            <div className="relative">
              <TrackSuggestion
                value={currentTrackSearch}
                onChange={setCurrentTrackSearch}
                onSelect={handleTrackSelect}
                placeholder="Search for songs..."
              />
            </div>
          </div>

          {formData.tracks.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Tracks ({formData.tracks.length})</h4>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {formData.tracks.map((track, index) => (
                  <motion.div 
                    key={`${track.trackId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {track.albumArt ? (
                        <img src={track.albumArt} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{track.title}</p>
                        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      className="text-gray-500 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-full font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Playlist</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePlaylist;