// src/hooks/useXamanAuth.js
import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

// 🔄 Dynamic instance (regenerates fresh if needed)
let xumm = null;

export default function useXamanAuth() {
  const [isConnected, setIsConnected] = useState(false);
  const [xrpAddress, setXrpAddress] = useState('');
  const [loading, setLoading] = useState(false); // <--- CHANGED default from true ➔ false

  const initXumm = () => {
    xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

    xumm.on('success', async () => {
      const state = await xumm.state();
      if (state?.me?.account) {
        setIsConnected(true);
        setXrpAddress(state.me.account);
        console.log('✅ Wallet connected:', state.me.account);
      }
      setLoading(false); // <--- STOP loading when successful
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
      setLoading(true); // <--- Only set loading true when actually logging in
      initXumm(); // Fresh instance
      await xumm.logout(); // Always clear session first

      const isDev = import.meta.env.DEV; // Detect dev environment
      await xumm.authorize({ force: isDev }); // Force popup in dev
    } catch (err) {
      if (err?.message?.includes('window closed')) {
        console.warn('🛑 Xumm login window was closed by user.');
      } else {
        console.error('❌ Login error:', err);
      }
    } finally {
      setLoading(false); // Always clear loading
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
