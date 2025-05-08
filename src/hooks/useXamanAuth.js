// src/hooks/useXamanAuth.js

import { useEffect, useState } from "react";
import { Xumm } from "xumm-sdk";
import { useAuthStore } from "../store/useAuthStore";

const xumm = new Xumm(import.meta.env.VITE_XUMM_API_KEY);

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

  // Initialize XUMM event listeners (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    xumm.on("ready", () => {
      console.log("✅ XUMM SDK ready");
    });

    xumm.on("success", () => {
      console.log("🔐 XUMM login success");
      setAuthenticated(true);
    });

    xumm.on("logout", () => {
      console.log("🚪 XUMM logout triggered");
      logout();
      setResolved(false);
    });

    setLoading(false);
  }, []);

  // Resolve user account after login
  useEffect(() => {
    const resolveUser = async () => {
      try {
        const payload = await xumm.user.account;
        console.log("🟢 Resolved XUMM user:", payload);
        setXummUser(payload);         // Local state (optional)
        setAccount(payload);          // Global store (Zustand)
        setResolved(true);
      } catch (error) {
        console.warn("⚠️ Failed to resolve XUMM user:", error);
      }
    };

    if (isAuthenticated && !resolved && typeof window !== "undefined") {
      resolveUser();
    }
  }, [isAuthenticated, resolved]);

  const login = () => {
    xumm.authorize();
  };

  const disconnect = () => {
    xumm.logout();
  };

  return {
    login,
    disconnect,
    isAuthenticated,
    xummUser,
    loading,
  };
};
