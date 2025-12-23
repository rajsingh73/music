const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const freeSongs = require('../data/songs');

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '0b1e4ae72b495dd19de143f98858c297';

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

const fetchJamendo = async ({ term = '', page = 0, limit = 20 }) => {
  const offset = page * limit;
  const params = {
    client_id: JAMENDO_CLIENT_ID,
    format: 'json',
    limit,
    offset,
    include: 'musicinfo',
    audioformat: 'mp32',
    order: 'popularity_total',
  };

  if (term && term.trim()) {
    params.search = term.trim();
  }

  const { data } = await axios.get('https://api.jamendo.com/v3.0/tracks', { params });
  if (!data || data.headers.status !== 'success') {
    throw new Error('Jamendo returned an error');
  }

  return mapJamendoTracks(data.results || []);
};

router.get('/search', auth, async (req, res) => {
  try {
    const { term, page = 0 } = req.query;
    const limit = 20;
    const offset = page * limit;

    try {
      const jamendoTracks = await fetchJamendo({ term, page, limit });
      if (jamendoTracks.length > 0) {
        console.log(
          `Returning ${jamendoTracks.length} Jamendo tracks (search: "${term || 'all'}", page: ${page})`
        );
        return res.json(jamendoTracks);
      }
    } catch (err) {
      console.warn('Jamendo search failed, falling back to local collection:', err.message);
    }
    let filteredSongs = freeSongs;
    if (term && term.trim()) {
      const searchTerm = term.toLowerCase();
      filteredSongs = freeSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm) ||
          song.artist.toLowerCase().includes(searchTerm) ||
          song.genre.toLowerCase().includes(searchTerm) ||
          song.album.toLowerCase().includes(searchTerm)
      );
    }
    const paginatedSongs = filteredSongs.slice(offset, offset + limit);
    const songs = paginatedSongs.map((song) => ({
      trackId: song.id,
      title: song.title,
      artist: song.artist,
      albumArt: song.albumArt,
      previewUrl: song.audioUrl,
      collectionName: song.album,
      duration: song.duration,
      genre: song.genre,
    }));

    console.log(
      `Returning ${songs.length} songs from local collection (search: "${term || 'all'}", page: ${page})`
    );
    res.json(songs);
  } catch (err) {
    console.error('Search Error:', err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/browse', auth, async (req, res) => {
  try {
    const { page = 0 } = req.query;
    const limit = 20;
    const offset = page * limit;

    try {
      const jamendoTracks = await fetchJamendo({ page, limit });
      if (jamendoTracks.length > 0) {
        console.log(`Browsing returned ${jamendoTracks.length} Jamendo tracks (page: ${page})`);
        return res.json(jamendoTracks);
      }
    } catch (err) {
      console.warn('Jamendo browse failed, falling back to local collection:', err.message);
    }

    const paginatedSongs = freeSongs.slice(offset, offset + limit);
    const songs = paginatedSongs.map((song) => ({
      trackId: song.id,
      title: song.title,
      artist: song.artist,
      albumArt: song.albumArt,
      previewUrl: song.audioUrl,
      collectionName: song.album,
      duration: song.duration,
      genre: song.genre,
    }));

    console.log(`Browsing returned ${songs.length} songs from local collection (page: ${page})`);
    res.json(songs);
  } catch (err) {
    console.error('Browse Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

