const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const ListeningHistory = require('../models/ListeningHistory'); // Import Model
const freeSongs = require('../data/songs');

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '0b1e4ae72b495dd19de143f98858c297';

require('dotenv').config();

const streamRemoteAudio = async (audioUrl, res) => {
  try {
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'] || 'audio/mpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(Buffer.from(response.data));
  } catch (err) {
    console.warn('Audio proxy stream failed:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ msg: 'Failed to proxy audio stream.' });
    }
  }
};

// Helper to save history
const saveToHistory = async (userId, trackId, tags = []) => {
  try {
    // Optional: Prevent spamming history with the same song within 1 minute
    const lastListen = await ListeningHistory.findOne({ user: userId, trackId }).sort({ listenedAt: -1 });
    if (lastListen && (Date.now() - new Date(lastListen.listenedAt).getTime() < 60000)) {
      return; 
    }

    const history = new ListeningHistory({
      user: userId,
      trackId,
      moodTags: tags,
      listenedAt: Date.now()
    });
    await history.save();
    console.log(`Saved history for user ${userId}: ${trackId} [${tags.join(', ')}]`);
  } catch (err) {
    console.error('Failed to save listening history:', err.message);
  }
};

router.get('/:trackId', auth, async (req, res) => {
  try {
    const { trackId } = req.params;
    const shouldProxy = req.query.proxy === '1' || req.query.proxy === 'true';
    let previewUrl = '';
    let trackTags = [];

    // 1. Check Local Songs
    const song = freeSongs.find(song => song.id === trackId);
    if (song) {
      previewUrl = song.audioUrl;
      trackTags = [song.genre]; // Use local genre as tag
    }

    // 2. Check Generated/Browse Placeholders
    if (!previewUrl && (trackId.startsWith('generated_') || trackId.startsWith('browse_'))) {
      const indexMatch = trackId.match(/(\d+)$/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1]);
        if (index >= 0 && index < freeSongs.length) {
          const generatedSong = freeSongs[index];
          previewUrl = generatedSong.audioUrl;
          trackTags = [generatedSong.genre];
        }
      }
    }

    // 3. Check Jamendo API
    if (!previewUrl && trackId.startsWith('jamendo_')) {
      try {
        const jamendoId = trackId.replace('jamendo_', '');
        const { data } = await axios.get('https://api.jamendo.com/v3.0/tracks', {
          params: {
            client_id: JAMENDO_CLIENT_ID,
            format: 'json',
            id: jamendoId,
            include: 'musicinfo', // Critical: Get tags!
            audioformat: 'mp32',
          },
        });

        if (data && data.headers.status === 'success' && data.results && data.results.length > 0) {
          const jamendoTrack = data.results[0];
          if (jamendoTrack.audio) {
            previewUrl = jamendoTrack.audio;
            // Extract tags from musicinfo
            if (jamendoTrack.musicinfo && jamendoTrack.musicinfo.tags) {
              // Combine genres and vocal/instrumental tags
              trackTags = [
                ...(jamendoTrack.musicinfo.tags.genres || []),
                ...(jamendoTrack.musicinfo.tags.instruments || []),
                ...(jamendoTrack.musicinfo.tags.vartags || [])
              ];
            }
          }
        }
      } catch (err) {
        console.warn('Jamendo stream fetch failed:', err.message);
      }
    }

    // 4. Demo Fallbacks
    if (!previewUrl && (trackId.startsWith('demo_') || trackId.startsWith('fallback_'))) {
       // Use a real MP3 for fallback so it actually plays
       previewUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
       trackTags = ['demo'];
    }

    // 5. Ultimate Fallback
    if (!previewUrl) {
      console.log(`No audio URL found for track ${trackId}, using ultimate fallback`);
      previewUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      trackTags = ['unknown'];
    }

    // --- SAVE HISTORY ---
    // We save history here because this endpoint is hit when the user tries to play/load the song
    await saveToHistory(req.user.id, trackId, trackTags);

    if (shouldProxy) {
      return streamRemoteAudio(previewUrl, res);
    }

    return res.json({ previewUrl });

  } catch (err) {
    console.error('Stream API Error:', err.message);
    // Return a valid file even on error to prevent client breakage
    return res.json({
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    });
  }
});

module.exports = router;