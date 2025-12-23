import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, X, Search, Music, AlertCircle, Play } from 'lucide-react';
import TrackSuggestion from './TrackSuggestion';

const PlaylistDetail = ({ playTrack }) => { // Accept playTrack here
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tracks: [],
  });
  const [currentTrackSearch, setCurrentTrackSearch] = useState('');

  // Handle Escape Key to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') navigate('/dashboard');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Fetch Playlist Data
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const res = await axios.get(`/api/playlists/${id}`, {
          headers: { 'x-auth-token': token },
        });

        setFormData({
          name: res.data.name || '',
          description: res.data.description || '',
          tracks: res.data.tracks || [],
        });
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError('Failed to load playlist. It might have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id, navigate]);

  const handleTrackSelect = (track) => {
    setFormData(prev => ({
      ...prev,
      tracks: [...prev.tracks, {
        trackId: track.trackId || track.id,
        title: track.title,
        artist: track.artist,
        albumArt: track.albumArt
      }]
    }));
    setCurrentTrackSearch('');
  };

  const removeTrack = (index, e) => {
    e.stopPropagation(); // Stop click from bubbling up to playTrack
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/playlists/${id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to update playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/playlists/${id}`, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete playlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error Loading Playlist</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 pb-32">
      
      {/* Header / Nav */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <button 
          onClick={onDelete}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 rounded-full hover:bg-red-500/10 transition-all"
        >
          <Trash2 className="w-4 h-4" /> Delete Playlist
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-4xl mx-auto p-8"
      >
        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* Header Input Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl flex items-center justify-center shrink-0 border border-white/5">
              <Music className="w-16 h-16 text-gray-600" />
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Playlist Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-b border-white/10 w-full text-3xl md:text-5xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-primary py-2 transition-colors"
                  placeholder="My Playlist"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-transparent border-b border-white/10 w-full text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary py-2 transition-colors resize-none"
                  rows="2"
                  placeholder="Add an optional description"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5" />

          {/* Track Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Tracks</h3>
              <div className="w-64 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <div className="relative">
                  <TrackSuggestion
                    value={currentTrackSearch}
                    onChange={setCurrentTrackSearch}
                    onSelect={handleTrackSelect}
                    placeholder="Add songs..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5 min-h-[200px]">
              {formData.tracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <Music className="w-8 h-8 mb-2 opacity-50" />
                  <p>This playlist is empty. Add some tracks!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {formData.tracks.map((track, index) => (
                    <motion.div 
                      key={`${track.trackId}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => playTrack(track)} // Make it clickable to play
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 w-6 text-center font-mono text-sm group-hover:hidden">{index + 1}</span>
                        <span className="w-6 text-center hidden group-hover:block text-primary"><Play className="w-4 h-4 fill-current ml-1" /></span>

                        {track.albumArt ? (
                          <img src={track.albumArt} className="w-10 h-10 rounded shadow-sm" alt="" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center"><Music className="w-5 h-5 text-gray-600" /></div>
                        )}
                        <div>
                          <p className="text-white font-medium group-hover:text-primary transition-colors">{track.title}</p>
                          <p className="text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => removeTrack(index, e)} // Pass 'e' to stop propagation
                        className="text-gray-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove from playlist"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {isSubmitting ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default PlaylistDetail;