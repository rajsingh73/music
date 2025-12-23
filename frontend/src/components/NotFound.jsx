import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#191414] text-white">
      <h1 className="text-7xl md:text-8xl font-extrabold text-[#1DB954] mb-4 animate-bounce">404</h1>
      <p className="text-xl md:text-2xl text-[#B3B3B3] mb-8">Page Not Found</p>
      <Link
        to="/"
        className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;

