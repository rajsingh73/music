import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrackSuggestion = ({ value, onChange, onSelect, placeholder = "Search for a track..." }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTracks = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(`/api/music/search?term=${value}`, config);
        setSuggestions(res.data.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to search tracks:', err);
        setSuggestions([]);
      }
      setLoading(false);
    };

    const debounceTimer = setTimeout(searchTracks, 300); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleSelect = (track) => {
    onSelect(track);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1DB954]"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-[#282828] border border-gray-600 rounded-b-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((track) => (
            <div
              key={track.trackId}
              onClick={() => handleSelect(track)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer transition duration-200"
            >
              {track.albumArt && (
                <img src={track.albumArt} alt="Album Art" className="w-10 h-10 rounded-md object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{track.title}</p>
                <p className="text-[#B3B3B3] text-sm truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackSuggestion;
