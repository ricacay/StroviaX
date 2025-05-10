import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import ChainSelector from './ChainSelector';
import logo from '../assets/stroviax-logo.svg';
import useWallet from '../hooks/useWallet'; // ← import directly at top level

function WalletControls() {
  const { isConnected, address, connect, disconnect, loading, error } = useWallet();

  return (
    <>
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={disconnect}
            className="bg-red-500 text-white px-3 py-2 rounded hover:opacity-90 transition-all"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded hover:opacity-90 flex items-center transition-all"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-6 py-2 text-center text-sm font-medium mt-2">
          {error}
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  const navigate = useNavigate();

  const handleClick = () => navigate('/');

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border transition-colors duration-500">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={handleClick}>
          <img src={logo} alt="StroviaX Logo" className="w-10 h-10 mr-2" />
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            StroviaX
          </span>
        </div>

        {/* Navigation + Controls */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors">Home</Link>
          <Link to="/about" className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors">About</Link>
          <Link to="/admin/tips" className="text-lg font-medium hover:text-purple-600 dark:text-white dark:hover:text-purple-300 transition-colors">Admin Tips</Link>

          <ChainSelector />
          <DarkModeToggle />

          <WalletControls />
        </div>
      </div>
    </nav>
  );
}
