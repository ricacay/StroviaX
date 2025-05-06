import { ethers } from 'ethers';
import useChainStore from '../store/chainStore';

export async function submitTip(destinationAccount, amountInDrops, memo = '', sender = '') {
  const { chain } = useChainStore.getState();

  try {
    const timestamp = new Date().toISOString();

    // ✅ XRPL Flow
    if (chain === 'xrpl') {
      const response = await fetch('http://localhost:4000/create-tip-payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destinationAccount,
          amount: amountInDrops,
          memo,
        }),
      });

      if (!response.ok) throw new Error('Failed to create XRPL tip payload.');

      const data = await response.json();
      console.log('✅ XRPL Tip Payload Created:', data);

      // Log metadata
      await fetch('http://localhost:4000/api/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender,
          recipient: destinationAccount,
          amount: amountInDrops,
          memo,
          timestamp,
          chain,
        }),
      });

      // Open Xumm signing tab
      window.open(data.next, '_blank');
      return data.uuid;
    }

    // ✅ Ethereum Flow
    if (chain === 'ethereum') {
      if (typeof window === 'undefined' || !window.ethereum)
        throw new Error('MetaMask not available in this environment.');

      const amountInEth = (parseFloat(amountInDrops) / 1_000_000).toString();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const tx = {
        to: destinationAccount,
        value: ethers.utils.parseEther(amountInEth)._hex,
        from: accounts[0],
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      console.log('✅ ETH Tip Sent, TxHash:', txHash);

      // Log metadata
      await fetch('http://localhost:4000/api/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: accounts[0],
          recipient: destinationAccount,
          amount: amountInEth,
          memo,
          timestamp,
          chain,
        }),
      });

      return txHash;
    }

    throw new Error(`Unsupported chain: ${chain}`);
  } catch (error) {
    console.error('❌ Error submitting tip:', error);
    throw error;
  }
}
