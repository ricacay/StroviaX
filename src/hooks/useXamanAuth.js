import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

let xumm = null;

if (typeof window !== 'undefined') {
  xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);
}

export default function useXamanAuth() {
  const [xummUser, setXummUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const connect = () => {
    if (!xumm) return;
    xumm.authorize();
  };

  const disconnect = () => {
    if (!xumm) return;
    xumm.logout();
    setXummUser(null);
  };

  useEffect(() => {
    if (!xumm) return;

    console.log('✅ XummPkce ready');

    xumm.on('success', async () => {
      try {
        const userData = await xumm.user.account;
        console.log('🔐 XUMM OAuth login success');
        setXummUser(userData);
      } catch (err) {
        console.warn('⚠️ Failed to resolve XUMM user:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    xumm.on('logout', () => {
      setXummUser(null);
      console.log('👋 XUMM user logged out');
    });

    // Delayed resolve call
    const tryResolve = async () => {
      try {
        if (typeof xumm?.auth?.resolve === 'function') {
          await xumm.auth.resolve();
        }
      } catch (err) {
        // Fails silently if not ready yet
      }
    };

    tryResolve();
  }, []);

  return {
    isConnected: !!xummUser,
    address: xummUser,
    connect,
    disconnect,
    loading,
    error,
  };
}
