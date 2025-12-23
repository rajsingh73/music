const freeSongs = [
  {
    id: 'music_1',
    title: 'Welcome to Music',
    artist: 'Demo Artist',
    albumArt: 'https://via.placeholder.com/250x250/FF6B35/FFFFFF?text=🎵',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Electronic',
    duration: 372,
    album: 'Demo Collection'
  },
  {
    id: 'music_2',
    title: 'Jazz Cafe',
    artist: 'Jazz Ensemble',
    albumArt: 'https://via.placeholder.com/250x250/4ECDC4/FFFFFF?text=🎷',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Jazz',
    duration: 425,
    album: 'Jazz Collection'
  },
  {
    id: 'music_3',
    title: 'Rock Anthem',
    artist: 'Rock Band',
    albumArt: 'https://via.placeholder.com/250x250/45B7D1/FFFFFF?text=🎸',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Rock',
    duration: 340,
    album: 'Rock Collection'
  },
  {
    id: 'music_4',
    title: 'Classical Piano',
    artist: 'Piano Master',
    albumArt: 'https://via.placeholder.com/250x250/FED766/000000?text=🎹',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Classical',
    duration: 310,
    album: 'Classical Collection'
  },
  {
    id: 'music_5',
    title: 'Pop Sensation',
    artist: 'Pop Star',
    albumArt: 'https://via.placeholder.com/250x250/F39C12/FFFFFF?text=🎤',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Pop',
    duration: 350,
    album: 'Pop Collection'
  },
  {
    id: 'music_6',
    title: 'Ambient Dreams',
    artist: 'Ambient Producer',
    albumArt: 'https://via.placeholder.com/250x250/9B59B6/FFFFFF?text=🌌',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Ambient',
    duration: 400,
    album: 'Ambient Collection'
  },
  {
    id: 'music_7',
    title: 'Folk Acoustic',
    artist: 'Folk Singer',
    albumArt: 'https://via.placeholder.com/250x250/E74C3C/FFFFFF?text=🎸',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Folk',
    duration: 320,
    album: 'Folk Collection'
  },
  {
    id: 'music_8',
    title: 'Hip Hop Beat',
    artist: 'Hip Hop Producer',
    albumArt: 'https://via.placeholder.com/250x250/8E44AD/FFFFFF?text=🎧',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Hip Hop',
    duration: 220,
    album: 'Hip Hop Collection'
  },
  {
    id: 'music_9',
    title: 'Country Road',
    artist: 'Country Artist',
    albumArt: 'https://via.placeholder.com/250x250/27AE60/FFFFFF?text=🤠',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    genre: 'Country',
    duration: 260,
    album: 'Country Collection'
  },
  {
    id: 'music_10',
    title: 'Blues Guitar',
    artist: 'Blues Legend',
    albumArt: 'https://via.placeholder.com/250x250/8B4513/FFFFFF?text=🎸',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Blues',
    duration: 380,
    album: 'Blues Collection'
  }
];

// Add generic fillers if needed
const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 'Country', 'Folk', 'Ambient', 'Chill'];
const colors = ['FF5733', '33FF57', '3357FF', 'F033FF', 'FF33A8', '33FFF8', 'FF8333', '8B33FF', '33FF83', 'FF3380'];
const fallbackAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

for (let i = 20; i < 60; i++) {
  freeSongs.push({
    id: `collection_${i}`,
    title: `Track ${i - 19}`,
    artist: `Artist ${(i % 8) + 1}`,
    albumArt: `https://via.placeholder.com/250x250/${colors[i % colors.length]}/FFFFFF?text=${i - 19}`,
    audioUrl: fallbackAudioUrl,
    genre: genres[i % genres.length],
    duration: 300,
    album: `Collection ${(Math.floor(i / 10)) + 1}`
  });
}

module.exports = freeSongs;