import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/stroviax-logo.svg';
import useXamanAuth from '../hooks/useXamanAuth'; // <-- You forgot this import!

export default function Navbar() {
  const navigate = useNavigate();
  const { isConnected, xrpAddress, login, logout, loading } = useXamanAuth(); // <-- Pull your real wallet state

  const handleClick = () => navigate('/');

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border transition-colors duration-500">
      {/* Logo */}
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center cursor-pointer" onClick={handleClick}>
          <img src={logo} alt="StroviaX Logo" className="w-10 h-10 mr-2" />
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            StroviaX
          </span>
        </div>

        {/* Nav Links + Controls */}
        <div className="flex items-center space-x-6">
          <a href="/" className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors">
            Home
          </a>
          <a href="/about" className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors">
            About
          </a>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Wallet Connect Button */}
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
                {xrpAddress.slice(0, 6)}...{xrpAddress.slice(-4)}
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-2 rounded hover:opacity-90 transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded hover:opacity-90 flex items-center transition-all"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
