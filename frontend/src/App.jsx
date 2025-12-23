import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PlaylistDetail from './components/PlaylistDetail';
import CreatePlaylist from './components/CreatePlaylist';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import AudioControls from './components/AudioControls';
import './App.css';

// Wrapper component to use hooks like useLocation and useNavigate
const AppContent = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const playTrack = (track) => {
    setCurrentTrack(track);
  };

  // NEW: Centralized logout function that clears state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentTrack(null); // This stops the music and clears the player
    navigate('/login');
  };

  // Hide player on auth pages
  const hidePlayer = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className="bg-[#191414] min-h-screen text-white relative">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {/* Pass handleLogout to Dashboard */}
              <Dashboard playTrack={playTrack} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile playTrack={playTrack} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-playlist"
          element={
            <PrivateRoute>
              <CreatePlaylist />
            </PrivateRoute>
          }
        />
        <Route
          path="/playlist/:id"
          element={
            <PrivateRoute>
              <PlaylistDetail playTrack={playTrack} />
            </PrivateRoute>
          }
        />
        
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Persistent Audio Player */}
      {!hidePlayer && currentTrack && (
        <AudioControls track={currentTrack} />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;