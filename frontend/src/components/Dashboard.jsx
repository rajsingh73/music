import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
import ExploreMoreModal from './ExploreMoreModal';
import AddToPlaylistModal from './AddToPlaylistModal';
import { User, Play, X } from 'lucide-react';

const Dashboard = ({ playTrack, onLogout }) => { 
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const navigate = useNavigate();

  const loadFeaturedSongs = async (config) => {
    try {
      const res = await axios.get('/api/music/search?page=0', config);
      const songs = res.data.slice(0, 5); 
      setFeaturedSongs(songs);
    } catch (err) {
      console.error('Failed to load featured songs:', err);
      setFeaturedSongs([]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return navigate('/login');
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const userRes = await axios.get('/api/profile', config);
        setUser(userRes.data);

        const playlistsRes = await axios.get('/api/playlists', config);
        setPlaylists(playlistsRes.data);

        try {
          const recsRes = await axios.get('/api/recommendations', config);
          if (recsRes.data && recsRes.data.length > 0) {
            setRecommendations(recsRes.data);
          } else {
            await loadFeaturedSongs(config);
          }
        } catch (err) {
          await loadFeaturedSongs(config);
        }
      } catch (err) {
        console.error(err.response?.data);
        if (onLogout) onLogout(); 
        else navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate, onLogout]);

  const addTrackToPlaylist = (arg1, arg2) => {
    let track, event;

    // Handle different calling patterns:
    // Pattern 1: addTrackToPlaylist(event, track) - from Dashboard search results
    // Pattern 2: addTrackToPlaylist(track) - from ExploreMoreModal

    if (arg2 !== undefined) {
      // Pattern 1: two arguments (event, track)
      event = arg1;
      track = arg2;
    } else {
      // Pattern 2: one argument (track)
      track = arg1;
      event = null;
    }

    // Handle event stopping if we have an event
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation(); // Prevent playing when clicking "Add to Playlist"
    }

    if (!track) {
      console.error('No track provided to addTrackToPlaylist');
      return;
    }

    setSelectedTrack(track);
    setShowAddToPlaylistModal(true);
  };

  const closeAddToPlaylistModal = () => {
    setShowAddToPlaylistModal(false);
    setSelectedTrack(null);
  };

  const refreshPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const playlistsRes = await axios.get('/api/playlists', config);
      setPlaylists(playlistsRes.data);
    } catch (err) {
      console.error('Error refreshing playlists:', err);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const deletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/playlists/${playlistId}`, {
        headers: { 'x-auth-token': token }
      });
      // Remove the playlist from the local state
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err) {
      alert('Failed to delete playlist');
      console.error('Error deleting playlist:', err);
    }
  };

  const openExploreModal = () => {
    setShowExploreModal(true);
  };

  const closeExploreModal = () => {
    setShowExploreModal(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get(`/api/music/search?term=${searchTerm}`, config);
      setSearchResults(res.data);
    } catch (err) {
      alert('Failed to search for music');
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] text-white p-6 md:p-10 lg:p-12 pb-32">
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#282828]">
        <h1 className="text-4xl font-extrabold text-[#1DB954]">Welcome, {user && user.username}!</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-full transition duration-300"
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Music Search Section */}
      <div className="mb-12 p-6 bg-[#282828] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#1DB954] mb-6">Search for Music</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search by song title or artist..."
            className="flex-grow shadow-sm appearance-none border border-gray-600 rounded-full w-full py-3 px-5 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
          >
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#1DB954]">Search Results</h3>
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm"
                title="Clear search results"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
            {searchResults.map((track) => (
              <div 
                key={track.trackId} 
                onClick={() => playTrack(track)} // Click anywhere to play
                className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between transition duration-300 hover:bg-gray-700 cursor-pointer group"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="relative">
                    <img src={track.albumArt} alt="Album Art" className="w-16 h-16 rounded-md object-cover shadow-md" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{track.title}</h4>
                    <p className="text-[#B3B3B3]">{track.artist} - {track.collectionName}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0 z-10">
                  <button
                    onClick={(e) => addTrackToPlaylist(e, track)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 text-sm"
                  >
                    Add to Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Playlists Section */}
        <div className="p-6 bg-[#282828] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#1DB954] mb-6">Your Playlists</h2>
          <button
            onClick={() => navigate('/create-playlist')}
            className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full mb-6 transition duration-300"
          >
            Create New Playlist
          </button>
          {playlists.length > 0 ? (
            <div className="space-y-6">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} playTrack={playTrack} onDelete={deletePlaylist} />
              ))}
            </div>
          ) : (
            <p className="text-[#B3B3B3] text-lg">You don't have any playlists yet. Create one!</p>
          )}
        </div>

        {/* Recommendations/Featured Songs Section */}
        <div className="p-6 bg-[#282828] rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#1DB954]">
              {recommendations.length > 0 ? 'Recommended For You' : 'Featured Songs'}
            </h2>
            <button
              onClick={openExploreModal}
              className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              Explore More
            </button>
          </div>
          {(recommendations.length > 0 || featuredSongs.length > 0) ? (
            <div className="space-y-6">
              {(recommendations.length > 0 ? recommendations : featuredSongs).map((track) => (
                <div 
                  key={track.trackId || track.id} 
                  onClick={() => playTrack(track)}
                  className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between transition duration-300 hover:bg-gray-700 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={track.albumArt} alt="Album Art" className="w-16 h-16 rounded-md object-cover shadow-md" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{track.title}</h3>
                      <p className="text-[#B3B3B3]">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 z-10">
                    <button
                      onClick={(e) => addTrackToPlaylist(e, track)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 text-sm"
                    >
                      Add to Playlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#B3B3B3] text-lg">Loading songs...</p>
          )}
        </div>
      </div>

      <ExploreMoreModal
        isOpen={showExploreModal}
        onClose={closeExploreModal}
        playTrack={playTrack}
        addToPlaylist={addTrackToPlaylist}
      />

      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={closeAddToPlaylistModal}
        track={selectedTrack}
        playlists={playlists}
        onPlaylistUpdate={refreshPlaylists}
      />
    </div>
  );
};

export default Dashboard;