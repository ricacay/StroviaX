// src/hooks/useXamanAuth.js

import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

const apiKey = import.meta.env.VITE_XUMM_API_KEY;
console.log("✅ [useXamanAuth] API Key Loaded:", apiKey);

if (!apiKey) {
  console.error("❌ [useXamanAuth] XUMM API Key is undefined! Check your .env file and restart the dev server.");
}

const xumm = new XummPkce(apiKey);

export default function useXamanAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.warn("🧪 [useXamanAuth] xumm event listeners disabled for debugging.");

    // Temporarily disabling success and logout event listeners to test white screen issue
    /*
    xumm.on('success', async () => {
      console.log("✅ [useXamanAuth] Login success event received.");

      try {
        const maybeState = await xumm.state();
        console.log("📦 [useXamanAuth] Post-login state:", maybeState);

        if (maybeState && maybeState.me) {
          setUser({
            wallet: maybeState.me.sub,
            name: maybeState.me.name || 'XRP User',
          });
        } else {
          console.warn("⚠️ [useXamanAuth] Post-login state missing `me` field.");
        }
      } catch (err) {
        console.error("❌ [useXamanAuth] Error during post-login xumm.state() call:", err);
      }
    });

    xumm.on('logout', () => {
      console.log("👋 [useXamanAuth] Logout detected.");
      setUser(null);
    });
    */
  }, []);

  const login = () => {
    console.log("🚀 [useXamanAuth] Initiating login...");
    xumm.authorize();
  };

  const logout = () => {
    console.log("🔒 [useXamanAuth] Logging out...");
    xumm.logout();
  };

  return { user, login, logout };
}
