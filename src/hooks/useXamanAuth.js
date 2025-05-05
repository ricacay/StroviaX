// src/hooks/useXamanAuth.js
import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

let xumm = null;

export default function useXamanAuth() {
  const [isConnected, setIsConnected] = useState(false);
  const [xrpAddress, setXrpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 🔴 New: error state

  const initXumm = () => {
    xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

    xumm.on('success', async () => {
      try {
        const state = await xumm.state();
        if (state?.me?.account) {
          setIsConnected(true);
          setXrpAddress(state.me.account);
          console.log('✅ Wallet connected:', state.me.account);
        } else {
          throw new Error('Wallet connected but no account info.');
        }
      } catch (err) {
        setError('Failed to fetch wallet state.');
        console.error('❌ Error retrieving wallet state:', err);
      } finally {
        setLoading(false);
      }
    });

    xumm.on('logout', () => {
      console.warn('⚠️ Wallet session expired or manually disconnected.');
      handleDisconnect();
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setXrpAddress('');
    setLoading(false);
    setError('Wallet disconnected.');
    xumm = null;
  };

  useEffect(() => {
    initXumm();
    return () => {
      xumm = null;
    };
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      initXumm();
      await xumm.logout(); // Always clear session
      const isDev = import.meta.env.DEV;
      await xumm.authorize({ force: isDev }); // Force popup in dev
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        console.warn('🛑 Xumm login window was closed by user.');
        setError('Login window closed.');
      } else {
        console.error('❌ Login error:', err);
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      if (xumm) xumm.logout();
    } catch (err) {
      console.warn('⚠️ Error during logout:', err);
    }
    handleDisconnect();
    window.location.reload();
  };

  return {
    isConnected,
    xrpAddress,
    loading,
    error, // 🔴 Expose error for UI feedback
    login,
    logout,
    xumm,
  };
}
