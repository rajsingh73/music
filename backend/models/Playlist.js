const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tracks: [
    {
      trackId: {
        type: String,
        required: true,
      },
      title: String,
      artist: String,
      albumArt: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Playlist', PlaylistSchema);

