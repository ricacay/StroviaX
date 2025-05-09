import { useEffect, useState } from "react";
import { XummPkce } from "xumm-oauth2-pkce";

// Guarded Xumm instance (only available on client)
let xumm = null;
if (typeof window !== "undefined") {
  xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);
}

export function useXamanAuth() {
  const [xummUser, setXummUser] = useState(null);

  useEffect(() => {
    if (!xumm) return;

    console.log("✅ XummPkce ready");

    xumm.on("success", () => {
      console.log("🔐 XUMM OAuth login success");
    });

    xumm.on("logout", () => {
      console.log("🚪 XUMM OAuth logout");
      setXummUser(null);
    });

    // Attempt to fetch user data after login
    xumm.user.account
      .then((userData) => {
        console.log("👤 Resolved XUMM user:", userData);
        setXummUser(userData);
      })
      .catch((err) => {
        console.warn("⚠️ Failed to resolve XUMM user:", err);
      });
  }, []);

  const login = () => {
    if (xumm) xumm.authorize();
  };

  const disconnect = () => {
    if (xumm) xumm.logout();
  };

  return {
    login,
    disconnect,
    xummUser,
    xumm,
  };
}
