// useWallet.js
// Multichain wallet abstraction (XRPL + Ethereum stub)

import { useEffect, useState } from 'react';
import useXamanAuth from './useXamanAuth';
import useChainStore from '../store/chainStore';

export default function useWallet() {
  const { chain } = useChainStore();

  // Local state for MetaMask
  const [ethAddress, setEthAddress] = useState('');
  const [ethConnected, setEthConnected] = useState(false);
  const [ethLoading, setEthLoading] = useState(false);
  const [ethError, setEthError] = useState(null);

  // XRPL Wallet (Xaman)
  if (chain === 'xrpl') {
    const xaman = useXamanAuth();
    return {
      chain,
      isConnected: xaman.isConnected,
      address: xaman.xrpAddress,
      loading: xaman.loading,
      error: xaman.error,
      connect: xaman.login,
      disconnect: xaman.logout,
      raw: xaman.xumm,
    };
  }

  // Ethereum Wallet (MetaMask)
  if (chain === 'ethereum') {
    const connect = async () => {
      if (!window.ethereum) {
        setEthError('MetaMask not detected');
        return;
      }
      setEthLoading(true);
      setEthError(null);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthAddress(accounts[0]);
        setEthConnected(true);
      } catch (err) {
        setEthError('User denied MetaMask connection.');
      } finally {
        setEthLoading(false);
      }
    };

    const disconnect = () => {
      setEthConnected(false);
      setEthAddress('');
      setEthError(null);
    };

    return {
      chain,
      isConnected: ethConnected,
      address: ethAddress,
      loading: ethLoading,
      error: ethError,
      connect,
      disconnect,
      raw: window.ethereum,
    };
  }

  // Unsupported chain fallback
  return {
    chain,
    isConnected: false,
    address: '',
    loading: false,
    error: `Chain '${chain}' not yet supported.`,
    connect: () => alert(`Connect not supported for '${chain}' yet.`),
    disconnect: () => {},
    raw: null,
  };
}
