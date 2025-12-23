const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ListeningHistory = require('../models/ListeningHistory');
const axios = require('axios');

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '0b1e4ae72b495dd19de143f98858c297';

// Helper to format Jamendo tracks for our frontend
const mapJamendoTracks = (tracks) =>
  tracks.map((track) => ({
    trackId: `jamendo_${track.id}`,
    title: track.name,
    artist: track.artist_name,
    albumArt: track.album_image || track.album_image_original,
    previewUrl: track.audio,
    collectionName: track.album_name,
    duration: track.duration,
    genre:
      (track.musicinfo &&
        track.musicinfo.tags &&
        track.musicinfo.tags.genres &&
        track.musicinfo.tags.genres[0]) ||
      'Unknown',
  }));

router.get('/', auth, async (req, res) => {
  try {
    // 1. Analyze User Behavior
    const userHistory = await ListeningHistory.find({ user: req.user.id })
      .sort({ listenedAt: -1 })
      .limit(20); // Look at last 20 songs

    let tagsParam = '';
    
    if (userHistory.length > 0) {
      // Count frequency of tags
      const tagCounts = {};
      userHistory.forEach((item) => {
        if (item.moodTags && item.moodTags.length > 0) {
          item.moodTags.forEach((tag) => {
            if (tag) {
              const cleanTag = tag.toLowerCase().trim();
              tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
            }
          });
        }
      });

      // Sort tags by popularity
      const sortedTags = Object.keys(tagCounts).sort(
        (a, b) => tagCounts[b] - tagCounts[a]
      );
      
      // Pick top 3 tags for the query
      if (sortedTags.length > 0) {
        tagsParam = sortedTags.slice(0, 3).join('+');
        console.log(`User ${req.user.id} Top Tags: ${tagsParam}`);
      }
    }

    // 2. Fetch from Jamendo API
    const params = {
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: 10,
      include: 'musicinfo',
      audioformat: 'mp32',
    };

    if (tagsParam) {
      // Personalized: Search using user's tags
      params.tags = tagsParam;
      params.boost = 'popularity_total'; // Popular songs within those tags
    } else {
      // Cold Start: No history? Show generic trending songs
      console.log('No history found. Fetching generic trending songs.');
      params.order = 'popularity_week';
    }

    try {
      const { data } = await axios.get('https://api.jamendo.com/v3.0/tracks', { params });

      if (data && data.results && data.results.length > 0) {
        const recommendedTracks = mapJamendoTracks(data.results);
        return res.json(recommendedTracks);
      } else {
        // API returned empty (rare, but possible if tags are obscure)
        // Fallback to generic popular if personalized search yields nothing
        if (tagsParam) {
            console.log('Personalized search empty, retrying with generic trending...');
            delete params.tags;
            params.order = 'popularity_week';
            const retryRes = await axios.get('https://api.jamendo.com/v3.0/tracks', { params });
            if (retryRes.data && retryRes.data.results) {
                 return res.json(mapJamendoTracks(retryRes.data.results));
            }
        }
        return res.json([]); // Truly empty
      }
    } catch (apiErr) {
      console.error('Jamendo API Error:', apiErr.message);
      // Return empty array instead of local music on error, as requested
      return res.json([]); 
    }

  } catch (err) {
    console.error('Recommendation Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;