import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  account: null,

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setAccount: (accountData) => set({ account: accountData }),
  logout: () => set({ isAuthenticated: false, account: null }),
}));
