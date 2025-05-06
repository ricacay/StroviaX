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

  const isBrowser = typeof window !== 'undefined';
  const isWalletRoute = isBrowser && !location.pathname.startsWith('/admin');

  const handleDisconnect = () => {
    setIsConnected(false);
    setXrpAddress('');
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (!isWalletRoute || xummRef.current) return;

    const apiKey = import.meta.env.VITE_XUMM_API_KEY;
    if (!apiKey) {
      console.error('❌ VITE_XUMM_API_KEY is missing.');
      setError('Xumm API key not found.');
      return;
    }

    try {
      xummRef.current = new XummPkce(apiKey);

      xummRef.current.on('success', async () => {
        try {
          const state = await xummRef.current.state();
          if (state?.me?.account) {
            console.log('✅ Connected to XRPL:', state.me.account);
            setIsConnected(true);
            setXrpAddress(state.me.account);
            setTriggerResolve(true);
          } else {
            throw new Error('No account returned in wallet state.');
          }
        } catch (err) {
          console.error('❌ Error fetching wallet state:', err);
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
    } catch (err) {
      console.error('❌ Xumm initialization failed:', err);
      setError('Xumm initialization failed.');
    }

    return () => {
      xummRef.current = null;
    };
  }, [isWalletRoute]);

  useEffect(() => {
    let interval;

    if (triggerResolve && xummRef.current) {
      interval = setInterval(async () => {
        try {
          if (
            xummRef.current.auth &&
            typeof xummRef.current.auth.resolve === 'function'
          ) {
            const resolved = await xummRef.current.auth.resolve();
            console.log('🔍 Resolved Xumm payload:', resolved);
            clearInterval(interval);
            setTriggerResolve(false);
          } else {
            console.warn('⏳ Waiting for xumm.auth.resolve...');
          }
        } catch (err) {
          console.warn('♻️ Retrying resolve:', err?.message || err);
        }
      }, 500);
    }

    return () => clearInterval(interval);
  }, [triggerResolve]);

  const login = async () => {
    if (!xummRef.current || !isWalletRoute) return;

    const apiKey = import.meta.env.VITE_XUMM_API_KEY;
    if (!apiKey) {
      setError('Missing Xumm API Key');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await xummRef.current.logout(); // clean session
      const isDev = import.meta.env.DEV;
      await xummRef.current.authorize({ force: isDev });
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        setError('Login window was closed.');
      } else {
        console.error('❌ Login failed:', err);
        setError('Login failed. Please try again.');
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
        console.warn('⚠️ Logout error:', err);
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
