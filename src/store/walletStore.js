import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWalletStore = create(
  persist(
    (set) => ({
      wallet: null,
      connectWallet: (address) =>
        set({ wallet: address || 'rTEST_FAKE_XRP123456789' }),
      disconnectWallet: () => set({ wallet: null }),
    }),
    {
      name: 'stroviax-wallet-storage', // localStorage key name
    }
  )
);

export default useWalletStore;
