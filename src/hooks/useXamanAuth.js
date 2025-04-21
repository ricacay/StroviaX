// src/hooks/useXamanAuth.js
import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

const apiKey = import.meta.env.VITE_XUMM_API_KEY;
console.log("✅ [useXamanAuth] API Key Loaded:", apiKey);

const xumm = new XummPkce(apiKey);

export default function useXamanAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      console.error("❌ [useXamanAuth] Missing XUMM API Key!");
      return;
    }

    let unsubscribeSuccess, unsubscribeLogout;

    xumm.on("ready", async () => {
      console.log("✅ [useXamanAuth] Xumm SDK ready.");

      unsubscribeSuccess = xumm.on("success", async () => {
        console.log("✅ [useXamanAuth] Login success.");

        try {
          const state = await xumm.state();
          console.log("📦 [useXamanAuth] State:", state);

          if (state?.me?.sub) {
            setUser({
              wallet: state.me.sub,
              name: state.me.name || "XRP User",
            });
          } else {
            console.warn("⚠️ [useXamanAuth] No user info in state.");
          }
        } catch (err) {
          console.error("❌ [useXamanAuth] xumm.state() failed:", err);
        }
      });

      unsubscribeLogout = xumm.on("logout", () => {
        console.log("👋 [useXamanAuth] Logged out.");
        setUser(null);
      });
    });

    return () => {
      // Clean up event listeners
      unsubscribeSuccess?.();
      unsubscribeLogout?.();
    };
  }, []);

  const login = () => {
    console.log("🚀 [useXamanAuth] Logging in...");
    xumm.authorize();
  };

  const logout = () => {
    console.log("🔒 [useXamanAuth] Logging out...");
    xumm.logout();
  };

  return { user, login, logout };
}
