import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { XummPkce } from 'xumm-oauth2-pkce';

export default function useXamanAuth() {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [xrpAddress, setXrpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerResolve, setTriggerResolve] = useState(false);
  const xummRef = useRef(null);

  const isWalletRoute = typeof window !== 'undefined' && !location.pathname.startsWith('/admin');

  const handleDisconnect = () => {
    setIsConnected(false);
    setXrpAddress('');
    setLoading(false);
    setError(null);
  };

  // Safely initialize Xumm
  useEffect(() => {
    if (!isWalletRoute || xummRef.current) return;

    try {
      xummRef.current = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

      xummRef.current.on('success', async () => {
        try {
          const state = await xummRef.current.state();
          if (state?.me?.account) {
            setIsConnected(true);
            setXrpAddress(state.me.account);
            console.log('✅ Wallet connected:', state.me.account);
            setTriggerResolve(true);
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
      });

      xummRef.current.on('logout', () => {
        console.warn('⚠️ Xumm session expired or user logged out.');
        handleDisconnect();
      });
    } catch (e) {
      console.error('⚠️ Xumm init failed:', e);
      setError('Xumm initialization failed.');
    }

    return () => {
      xummRef.current = null;
    };
  }, [isWalletRoute]);

  // Retry .resolve() until Xumm auth is ready
  useEffect(() => {
    if (!triggerResolve || !xummRef.current?.auth?.resolve) return;

    const interval = setInterval(async () => {
      try {
        const resolved = await xummRef.current.auth.resolve();
        console.log('🔍 Resolved payload (delayed):', resolved);
        clearInterval(interval);
        setTriggerResolve(false);
      } catch (err) {
        console.warn('⚠️ Retrying resolve:', err?.message || err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [triggerResolve]);

  const login = async () => {
    if (!xummRef.current || !isWalletRoute) return;

    try {
      setLoading(true);
      setError(null);
      await xummRef.current.logout(); // Ensure clean session
      const isDev = import.meta.env.DEV;
      await xummRef.current.authorize({ force: isDev });
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        setError('Login window was closed.');
      } else {
        setError('Login failed. Please try again.');
        console.error('❌ Xumm login failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (xummRef.current) {
      try {
        xummRef.current.logout();
      } catch (err) {
        console.warn('⚠️ Error during logout:', err);
      }
    }
    handleDisconnect();
  };

  return {
    isConnected,
    xrpAddress,
    loading,
    error,
    login,
    logout,
    xumm: xummRef.current,
  };
}
