import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Heart, Disc, Play } from 'lucide-react';
import PlaylistCard from './PlaylistCard';

const Profile = ({ playTrack }) => { // Accept playTrack prop
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const config = { headers: { 'x-auth-token': token } };

        const [userRes, playlistRes] = await Promise.all([
          axios.get('/api/profile', config),
          axios.get('/api/playlists', config)
        ]);

        setUser(userRes.data);
        setPlaylists(playlistRes.data);
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen p-6 md:p-12 bg-[#121212] text-white pb-32">
      
      {/* Header */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      {/* Profile Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 mb-12"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-2xl">
          <User className="w-16 h-16 text-white" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Profile</h2>
          <h1 className="text-5xl font-bold mb-2">{user?.username}</h1>
          <p className="text-gray-400">{playlists.length} Public Playlists • {user?.favorites?.length || 0} Liked Songs</p>
        </div>
      </motion.div>

      {/* Favorites Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" /> Liked Songs
        </h2>
        {user?.favorites && user.favorites.length > 0 ? (
          <div className="glass-card overflow-hidden">
            {user.favorites.map((track, index) => (
              <div 
                key={track.trackId} 
                onClick={() => playTrack(track)} // Enable Play on click
                className="flex items-center justify-between p-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-none group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-6 text-center group-hover:hidden">{index + 1}</span>
                  <span className="w-6 text-center hidden group-hover:block text-primary"><Play className="w-4 h-4 fill-current ml-1" /></span>
                  
                  <img src={track.albumArt || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover shadow-sm" />
                  <div>
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">{track.title}</h4>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 font-mono flex items-center gap-2">
                   <Heart className="w-4 h-4 fill-primary text-primary" /> Liked
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic bg-white/5 p-8 rounded-lg text-center">
            No liked songs yet. Go to the dashboard to find music you love!
          </div>
        )}
      </div>

      {/* Playlists Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Disc className="w-6 h-6 text-purple-400" /> Your Playlists
        </h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map(playlist => (
              <PlaylistCard key={playlist._id} playlist={playlist} playTrack={playTrack} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">No playlists created yet.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;