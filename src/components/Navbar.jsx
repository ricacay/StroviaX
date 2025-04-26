import React from 'react';
import { useNavigate } from 'react-router-dom';
import useXamanAuth from '../hooks/useXamanAuth';
import useDarkMode from '../hooks/useDarkMode';
import logo from '../assets/stroviax-logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const { isConnected, xrpAddress, logout } = useXamanAuth(); // Removed login and loading
  const { enabled, toggle } = useDarkMode();

  const handleClick = () => navigate('/');

  const handleConnectWallet = () => {
    window.location.href = 'http://localhost:4000/auth';
  };

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
          <a
            href="/"
            className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors"
          >
            About
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggle}
            className="text-sm px-3 py-1 rounded-full border dark:border-white border-gray-500 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {enabled ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Wallet Connect/Disconnect */}
          {isConnected ? (
            <>
              <span className="text-sm font-mono text-yellow-600 dark:text-yellow-400">
                Connected: {xrpAddress.slice(0, 6)}...{xrpAddress.slice(-4)}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded hover:opacity-90 flex items-center transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
