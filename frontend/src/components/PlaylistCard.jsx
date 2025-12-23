import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const PlaylistCard = ({ playlist, playTrack, onDelete }) => {
  return (
    <div className="bg-[#282828] p-5 rounded-lg shadow-xl transition duration-300 hover:scale-[1.02] hover:bg-gray-700">
      <h3 className="text-2xl font-bold text-white mb-3">{playlist.name}</h3>
      <p className="text-[#B3B3B3] mb-4">{playlist.description}</p>
      <div className="space-y-3">
        {playlist.tracks.length > 0 ? (
          playlist.tracks.map((track) => (
            <div key={track.trackId} className="flex items-center justify-between bg-gray-800 p-3 rounded-md transition duration-200 hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                {track.albumArt && <img src={track.albumArt} alt="Album Art" className="w-10 h-10 rounded-full object-cover shadow-md" />}
                <div>
                  <p className="font-semibold text-white">{track.title}</p>
                  <p className="text-sm text-[#B3B3B3]">{track.artist}</p>
                </div>
              </div>
              <button
                onClick={() => playTrack(track)}
                className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-sm transition duration-300 transform hover:scale-105"
              >
                Play
              </button>
            </div>
          ))
        ) : (
          <p className="text-[#B3B3B3] text-sm">No tracks in this playlist yet.</p>
        )}
      </div>
      <div className="mt-5 flex justify-between items-center">
        <Link
          to={`/playlist/${playlist._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 transform hover:scale-105"
        >
          Edit Playlist
        </Link>
        <button
          onClick={() => onDelete(playlist._id)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;

