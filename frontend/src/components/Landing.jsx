import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Play, Users, Heart, Search, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Smart Music Discovery",
      description: "Search and discover new tracks with our intelligent music search engine"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Playlist Management",
      description: "Create, edit, and manage playlists with our intuitive interface"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Personal Favorites",
      description: "Save your favorite tracks and get personalized recommendations"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Seamless Playback",
      description: "Enjoy high-quality audio playback with advanced controls"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191414] via-[#0f0f23] to-[#191414] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-purple-500/10 opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Music className="relative w-20 h-20 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
              SonicStream
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your personal music streaming experience. Discover, create, and manage playlists with seamless playback and smart recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Users className="w-5 h-5" />
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="glass-button text-lg px-8 py-4 hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-card max-w-4xl mx-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white">Play Anywhere</h3>
                  <p className="text-gray-400 text-sm">Seamless music playback</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Music className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white">Unlimited Music</h3>
                  <p className="text-gray-400 text-sm">Access to vast music library</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white">Personal Touch</h3>
                  <p className="text-gray-400 text-sm">Curate your music experience</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose TuneFlow?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience music streaming like never before with our innovative features designed for music lovers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Music Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of music lovers who have discovered their perfect soundtrack.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
          >
            Start Your Musical Journey
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">TuneFlow</span>
          </div>
          <p className="text-gray-400">
            © 2024 TuneFlow. Your personal music streaming companion.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
