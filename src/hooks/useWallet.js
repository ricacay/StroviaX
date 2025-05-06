import useXamanAuth from './useXamanAuth';
import useChainStore from '../store/chainStore';

export default function useWallet() {
  const { chain } = useChainStore();

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

  // 🧩 Placeholder for other chain integrations
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
