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

  const handleDisconnect = () => {
    setIsConnected(false);
    setXrpAddress('');
    setLoading(false);
    setError(null);
    xumm = null;
  };

  const handleSuccess = async () => {
    try {
      const state = await xumm.state();

      // ✅ Safely attempt .resolve() only if available
      if (xumm?.auth?.resolve && typeof xumm.auth.resolve === 'function') {
        try {
          const resolved = await xumm.auth.resolve();
          console.log('🔍 Resolved payload:', resolved);
        } catch (resolveErr) {
          console.warn('⚠️ auth.resolve() failed:', resolveErr);
        }
      } else {
        console.warn('⚠️ xumm.auth.resolve is undefined or not a function');
      }

      if (state?.me?.account) {
        setIsConnected(true);
        setXrpAddress(state.me.account);
        console.log('✅ Wallet connected:', state.me.account);
      } else {
        throw new Error('No account found in wallet state.');
      }
    } catch (err) {
      console.error('❌ Wallet state fetch failed:', err);
      setError('Failed to load wallet state.');
      handleDisconnect();
    } finally {
      setLoading(false);
    }
  };

  const initXumm = () => {
    if (!isWalletRoute) return;

    if (!xumm) {
      xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);
      xumm.on('success', handleSuccess);
      xumm.on('logout', () => {
        console.warn('⚠️ Xumm session expired or user logged out.');
        handleDisconnect();
      });
    }
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
      await xumm.logout();
      const isDev = import.meta.env.DEV;
      await xumm.authorize({ force: isDev });
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        console.warn('🛑 Xumm login window closed by user.');
        setError('Login window was closed.');
      } else {
        console.error('❌ Xumm login failed:', err);
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
