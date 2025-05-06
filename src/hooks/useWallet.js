// useWallet.js
// Multichain-ready wallet abstraction (currently only XRPL)

import useXamanAuth from './useXamanAuth';

export default function useWallet() {
  // Default to XRPL for now
  const chain = 'xrpl'; // eventually dynamic

  // XRPL Wallet (Xaman)
  const xaman = useXamanAuth();

  // Map wallet interface
  const wallet = {
    chain,
    isConnected: xaman.isConnected,
    address: xaman.xrpAddress,
    loading: xaman.loading,
    error: xaman.error,
    connect: xaman.login,
    disconnect: xaman.logout,
    raw: xaman.xumm, // expose raw provider for low-level use if needed
  };

  return wallet;
}
