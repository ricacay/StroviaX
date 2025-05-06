import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWalletStore = create(
  persist(
    (set) => ({
      wallet: null, // { chain: 'xrpl', address: '...' }

      connectWallet: (address, chain = 'xrpl') =>
        set({ wallet: { chain, address: address || 'rTEST_FAKE_XRP123456789' } }),

      disconnectWallet: () => set({ wallet: null }),
    }),
    {
      name: 'stroviax-wallet-storage', // localStorage key name
    }
  )
);

export default useWalletStore;
