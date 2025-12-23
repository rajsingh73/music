const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');


router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.put('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newTrack = req.body;

    if (user.favorites.some(track => track.trackId === newTrack.trackId)) {
      return res.status(400).json({ msg: 'Track already in favorites' });
    }

    user.favorites.unshift(newTrack);
    await user.save();
    
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/favorites/:trackId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.favorites = user.favorites.filter(
      track => track.trackId !== req.params.trackId
    );

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;