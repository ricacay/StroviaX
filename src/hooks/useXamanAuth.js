import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { XummPkce } from 'xumm-oauth2-pkce';

let xumm = null;

export default function useXamanAuth() {
  // Prevent hook execution in SSR
  if (typeof window === 'undefined') {
    return {
      isConnected: false,
      xrpAddress: '',
      loading: false,
      error: 'Wallet not available in SSR',
      login: () => {},
      logout: () => {},
      xumm: null,
    };
  }

  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [xrpAddress, setXrpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerResolve, setTriggerResolve] = useState(false);

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
      if (state?.me?.account) {
        setIsConnected(true);
        setXrpAddress(state.me.account);
        console.log('✅ Wallet connected:', state.me.account);
        setTriggerResolve(true); // Delay resolve after successful state
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

  // ✳️ Wait and retry until xumm.auth.resolve becomes safely available
  useEffect(() => {
    let interval;
    if (triggerResolve && xumm) {
      interval = setInterval(async () => {
        try {
          if (
            typeof xumm.auth?.resolve === 'function'
          ) {
            const resolved = await xumm.auth.resolve();
            console.log('🔍 Resolved payload (delayed):', resolved);
            clearInterval(interval);
            setTriggerResolve(false);
          }
        } catch (err) {
          console.warn('⚠️ Retrying resolve:', err?.message || err);
        }
      }, 500); // Retry every 500ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [triggerResolve]);

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
      await xumm.logout(); // Force clean session
      const isDev = import.meta.env.DEV;
      await xumm.authorize({ force: isDev });
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        console.warn('🛑 Login window closed by user.');
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
