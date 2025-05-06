import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { XummPkce } from 'xumm-oauth2-pkce';

let xumm = null;

export default function useXamanAuth() {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [xrpAddress, setXrpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isWalletRoute = !location.pathname.startsWith('/admin');

  const initXumm = () => {
    if (!isWalletRoute) return;

    xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

    xumm.on('success', async () => {
      try {
        const state = await xumm.state();

        // ✅ Crash protection for auth.resolve
        if (xumm.auth && typeof xumm.auth.resolve === 'function') {
          try {
            const resolved = await xumm.auth.resolve();
            console.log('🔍 Resolved payload:', resolved);
          } catch (resolveErr) {
            console.warn('⚠️ auth.resolve() failed:', resolveErr);
          }
        }

        if (state?.me?.account) {
          setIsConnected(true);
          setXrpAddress(state.me.account);
          console.log('✅ Wallet connected:', state.me.account);
        } else {
          throw new Error('Wallet connected but no account info.');
        }
      } catch (err) {
        console.error('❌ Wallet state error:', err);
        setError('Failed to retrieve wallet state.');
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
    if (!isWalletRoute) return;
    initXumm();
    return () => {
      xumm = null;
    };
  }, [isWalletRoute]);

  const login = async () => {
    if (!isWalletRoute) return;
    try {
      setLoading(true);
      setError(null);
      initXumm();
      await xumm.logout(); // Reset session
      const isDev = import.meta.env.DEV;
      await xumm.authorize({ force: isDev });
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
    if (!isWalletRoute) return;
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
    error,
    login,
    logout,
    xumm,
  };
}
