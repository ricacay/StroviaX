import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

// 🔄 Dynamic instance (regenerates fresh if needed)
let xumm = null;

export default function useXamanAuth() {
  const [isConnected, setIsConnected] = useState(false);
  const [xrpAddress, setXrpAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const initXumm = () => {
    xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

    xumm.on('success', async () => {
      const state = await xumm.state();
      if (state?.me?.account) {
        setIsConnected(true);
        setXrpAddress(state.me.account);
        console.log('✅ Wallet connected:', state.me.account);
      }
    });
  };

  useEffect(() => {
    initXumm(); // Initialize fresh Xumm instance
    return () => {
      xumm = null;
    };
  }, []);

  const login = async () => {
    try {
      initXumm(); // Make sure we have a fresh instance
      await xumm.logout(); // Always clear session before new login

      const isDev = import.meta.env.DEV; // 🚀 Detect if running in development
      await xumm.authorize({ force: isDev }); // Force popup only in dev mode
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        console.warn('🛑 Xumm login window was closed by user.');
      } else {
        console.error('❌ Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (xumm) {
      xumm.logout();
    }
    setIsConnected(false);
    setXrpAddress('');
    xumm = null;
    window.location.reload(); // Refresh page to fully reset
  };

  return {
    isConnected,
    xrpAddress,
    loading,
    login,
    logout,
    xumm,
  };
}
