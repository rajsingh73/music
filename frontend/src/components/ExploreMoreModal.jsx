import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const ExploreMoreModal = ({ isOpen, onClose, playTrack, addToPlaylist }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastSongElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreSongs();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMoreSongs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      // Get songs for browsing/exploration (will get free music from Jamendo)
      const res = await axios.get(`/api/music/browse?page=${page}`, config);
      const newSongs = res.data;

      if (newSongs.length === 0) {
        setHasMore(false);
      } else {
        setSongs(prevSongs => [...prevSongs, ...newSongs]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      console.error('Failed to load more songs:', err);
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setSongs([]);
      setPage(0);
      setHasMore(true);
      loadMoreSongs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#282828] rounded-lg shadow-2xl w-full max-w-4xl h-5/6 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Explore More Music</h2>
          <button
            onClick={onClose}
            className="text-[#B3B3B3] hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((track, index) => (
              <div
                key={`${track.trackId}-${index}`}
                ref={index === songs.length - 1 ? lastSongElementRef : null}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col"
              >
                <div className="flex items-center space-x-3 mb-3">
                  {track.albumArt && (
                    <img src={track.albumArt} alt="Album Art" className="w-12 h-12 rounded-md object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                    <p className="text-[#B3B3B3] text-xs truncate">{track.artist}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => playTrack(track)}
                    className="flex-1 bg-[#1DB954] hover:bg-green-600 text-white font-bold py-2 px-3 rounded-full text-xs transition duration-300 transform hover:scale-105"
                  >
                    Play Preview
                  </button>
                  <button
                    onClick={() => addToPlaylist(track)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-full text-xs transition duration-300 transform hover:scale-105"
                  >
                    Add to Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
              <p className="text-[#B3B3B3] mt-2">Loading more songs...</p>
            </div>
          )}

          {!hasMore && songs.length > 0 && (
            <div className="text-center py-8">
              <p className="text-[#B3B3B3]">No more songs to load</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreModal;
