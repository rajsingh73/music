// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');

// const app = express();

// // Connect Database
// connectDB();

// // Init Middleware
// app.use(express.json({ extended: false }));
// app.use(cors());

// app.get('/', (req, res) => res.send('API Running'));

// // Define Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/profile', require('./routes/profile'));
// app.use('/api/playlists', require('./routes/playlists'));
// app.use('/api/stream', require('./routes/stream'));
// app.use('/api/recommendations', require('./routes/recommendations'));
// app.use('/api/music', require('./routes/music'));




// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');

// const app = express();

// // Connect Database
// connectDB();

// // Init Middleware
// app.use(express.json({ extended: false }));
// app.use(cors());

// app.get('/', (req, res) => res.send('API Running'));

// // Define Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/profile', require('./routes/profile'));
// app.use('/api/playlists', require('./routes/playlists'));
// app.use('/api/stream', require('./routes/stream'));
// app.use('/api/recommendations', require('./routes/recommendations'));
// app.use('/api/music', require('./routes/music'));

// // CHANGED: Use port 5001 instead of 5000
// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');

// const app = express();

// // Connect Database
// connectDB();

// // Init Middleware
// app.use(express.json({ extended: false }));
// app.use(cors());

// app.get('/', (req, res) => res.send('API Running'));

// // Define Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/profile', require('./routes/profile'));
// app.use('/api/playlists', require('./routes/playlists'));
// app.use('/api/stream', require('./routes/stream'));
// app.use('/api/recommendations', require('./routes/recommendations'));
// app.use('/api/music', require('./routes/music'));

// // CHANGED: Use port 5001 instead of 5000
// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware

// UPDATED: Explicitly define the origin to allow your Vite frontend
app.use(cors({
  origin: 'http://localhost:5173', // Must match your frontend URL exactly
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // Allows cookies and authorization headers to be sent
}));

app.use(express.json({ extended: false }));

// Optional: Add this logger to verify requests are actually reaching the server
app.use((req, res, next) => {
  console.log(`[Request Received]: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/stream', require('./routes/stream'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/music', require('./routes/music'));

// CHANGED: Use port 5001 instead of 5000
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));