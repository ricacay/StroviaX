// src/hooks/useXamanAuth.js

import { useEffect, useState } from "react";
import { XummPkce } from "xumm-oauth2-pkce";
import { useAuthStore } from "../store/useAuthStore";

// ✅ Correct for frontend/browser use
const xumm = new XummPkce(import.meta.env.VITE_XUMM_API_KEY);

export const useXamanAuth = () => {
  const [xummUser, setXummUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);

  const {
    isAuthenticated,
    setAuthenticated,
    setAccount,
    logout,
  } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    xumm.on("ready", () => {
      console.log("✅ XummPkce ready");
    });

    xumm.on("success", () => {
      console.log("🔐 XUMM OAuth login success");
      setAuthenticated(true);
    });

    xumm.on("logout", () => {
      console.log("🚪 User logged out");
      logout();
      setResolved(false);
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    const resolveUser = async () => {
      try {
        const userData = await xumm.user.account;
        console.log("🟢 Resolved XUMM user:", userData);
        setXummUser(userData);
        setAccount(userData);
        setResolved(true);
      } catch (error) {
        console.warn("⚠️ Failed to resolve XUMM user:", error);
      }
    };

    if (isAuthenticated && !resolved && typeof window !== "undefined") {
      resolveUser();
    }
  }, [isAuthenticated, resolved]);

  const login = () => xumm.authorize();
  const disconnect = () => xumm.logout();

  return {
    login,
    disconnect,
    isConnected: isAuthenticated,
    xrpAddress: xummUser,
    loading,
    error: null,
    xumm,
  };
};
