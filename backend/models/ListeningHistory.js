const mongoose = require('mongoose');

const ListeningHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  trackId: {
    type: String,
    required: true,
  },
  listenedAt: {
    type: Date,
    default: Date.now,
  },
  moodTags: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('ListeningHistory', ListeningHistorySchema);

