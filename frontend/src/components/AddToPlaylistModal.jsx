import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { X, Plus, ListMusic, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const AddToPlaylistModal = ({ isOpen, onClose, track, playlists, onPlaylistUpdate }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no track is provided, don't render
  if (!track) return null;

  const addToExistingPlaylist = async (playlistId) => {
    if (!track) {
      console.error('No track available for adding to playlist');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      // Get the current playlist
      const playlistRes = await axios.get(`/api/playlists/${playlistId}`, {
        headers: { 'x-auth-token': token }
      });

      const currentTracks = playlistRes.data.tracks || [];

      // Check if track already exists
      const trackExists = currentTracks.some(t =>
        (t.trackId || t.id) === (track.trackId || track.id)
      );

      if (trackExists) {
        alert('This track is already in the playlist!');
        setIsSubmitting(false);
        return;
      }

      // Add the new track
      const updatedTracks = [...currentTracks, {
        trackId: track.trackId || track.id,
        title: track.title || 'Unknown Title',
        artist: track.artist || 'Unknown Artist',
        albumArt: track.albumArt
      }];

      // Update the playlist
      await axios.put(`/api/playlists/${playlistId}`, {
        name: playlistRes.data.name,
        description: playlistRes.data.description,
        tracks: updatedTracks
      }, {
        headers: { 'x-auth-token': token }
      });

      // Update local state if callback provided
      if (onPlaylistUpdate) {
        onPlaylistUpdate();
      }

      onClose();
    } catch (err) {
      console.error('Error adding track to playlist:', err);
      alert('Failed to add track to playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createNewPlaylist = () => {
    onClose();
    navigate('/create-playlist', { state: { trackToAdd: track } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <ListMusic className="w-6 h-6 text-primary" />
          Add to Playlist
        </h2>

        {/* Track Info */}
        <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
          <div className="flex items-center gap-3">
            {track?.albumArt ? (
              <img src={track.albumArt} alt="Album Art" className="w-12 h-12 rounded object-cover" />
            ) : (
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                <Music className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{track?.title || 'Unknown Title'}</p>
              <p className="text-sm text-gray-400 truncate">{track?.artist || 'Unknown Artist'}</p>
            </div>
          </div>
        </div>

        {/* Create New Playlist Button */}
        <button
          onClick={createNewPlaylist}
          className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mb-4 transition duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Playlist
        </button>

        {/* Existing Playlists */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-medium text-white mb-3">
            Add to Existing Playlist
          </h3>

          {playlists.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              You don't have any playlists yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => addToExistingPlaylist(playlist._id)}
                  disabled={isSubmitting}
                  className="w-full bg-white/5 hover:bg-white/10 text-left p-3 rounded-lg border border-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{playlist.name}</p>
                      <p className="text-sm text-gray-400">
                        {playlist.tracks?.length || 0} tracks
                      </p>
                    </div>
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddToPlaylistModal;
