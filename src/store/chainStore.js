// chainStore.js
// Global Zustand store for selected blockchain

import { create } from 'zustand';

const useChainStore = create((set) => ({
  chain: 'xrpl', // default chain
  setChain: (newChain) => set({ chain: newChain })
}));

export default useChainStore;
