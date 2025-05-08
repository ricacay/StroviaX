// useWallet.js (Safe for SSR and React Rules)
import { useEffect, useState } from 'react';
import { useXamanAuth } from './useXamanAuth'; // ✅ fixed named import
import useChainStore from '../store/chainStore';

export default function useWallet() {
  const { chain } = useChainStore();
  const xaman = useXamanAuth();

  const [ethState, setEthState] = useState({
    address: '',
    connected: false,
    loading: false,
    error: null,
    ethereum: null,
  });

  useEffect(() => {
    if (chain === 'ethereum' && typeof window !== 'undefined' && window.ethereum) {
      setEthState((prev) => ({ ...prev, ethereum: window.ethereum }));
    }
  }, [chain]);

  const connect = async () => {
    if (chain === 'xrpl') return xaman.login();
    if (chain === 'ethereum') {
      if (!ethState.ethereum) {
        setEthState((prev) => ({ ...prev, error: 'MetaMask not detected' }));
        return;
      }

      setEthState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const accounts = await ethState.ethereum.request({ method: 'eth_requestAccounts' });
        setEthState((prev) => ({
          ...prev,
          address: accounts[0],
          connected: true,
          loading: false,
        }));
      } catch (err) {
        setEthState((prev) => ({
          ...prev,
          error: 'User denied MetaMask connection.',
          loading: false,
        }));
      }
    }
  };

  const disconnect = () => {
    if (chain === 'xrpl') return xaman.logout();
    if (chain === 'ethereum') {
      setEthState({
        address: '',
        connected: false,
        loading: false,
        error: null,
        ethereum: window.ethereum,
      });
    }
  };

  if (chain === 'xrpl') {
    return {
      chain,
      isConnected: xaman.isConnected,
      address: xaman.xrpAddress,
      loading: xaman.loading,
      error: xaman.error,
      connect,
      disconnect,
      raw: xaman.xumm,
    };
  }

  if (chain === 'ethereum') {
    return {
      chain,
      isConnected: ethState.connected,
      address: ethState.address,
      loading: ethState.loading,
      error: ethState.error,
      connect,
      disconnect,
      raw: ethState.ethereum,
    };
  }

  return {
    chain,
    isConnected: false,
    address: '',
    loading: false,
    error: `Unsupported chain '${chain}'`,
    connect: () => alert(`Chain '${chain}' not supported yet.`),
    disconnect: () => {},
    raw: null,
  };
}
