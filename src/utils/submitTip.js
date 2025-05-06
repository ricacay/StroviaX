import { ethers } from 'ethers';
import useChainStore from '../store/chainStore';

export async function submitTip(destinationAccount, amountInDrops, memo = '', sender = '') {
  const { chain } = useChainStore.getState();
  const timestamp = new Date().toISOString();

  // Backend base URL (set this in your .env as NEXT_PUBLIC_API_URL)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  try {
    if (!destinationAccount || !amountInDrops || parseFloat(amountInDrops) <= 0) {
      throw new Error('Invalid tip parameters: destination and amount are required.');
    }

    // 🌐 XRPL Flow
    if (chain === 'xrpl') {
      const response = await fetch(`${API_BASE}/create-tip-payload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: destinationAccount, amount: amountInDrops, memo }),
      });

      if (!response.ok) throw new Error('Failed to create XRPL tip payload.');

      const data = await response.json();
      console.log('✅ XRPL Tip Payload Created:', data);

      // Log metadata
      await fetch(`${API_BASE}/api/tip`, {
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

      // Safe check for client-side window usage
      if (typeof window !== 'undefined') {
        window.open(data.next, '_blank');
      }

      return { status: 'pending', id: data.uuid };
    }

    // 🌐 Ethereum Flow
    if (chain === 'ethereum') {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not available in this environment.');
      }

      const amountInEth = (parseFloat(amountInDrops) / 1_000_000).toFixed(6);
      if (parseFloat(amountInEth) <= 0) throw new Error('ETH amount must be greater than zero.');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No Ethereum account connected.');

      const parsedValue = ethers.utils.parseEther(amountInEth);
      const tx = {
        to: destinationAccount,
        from: accounts[0],
        value: parsedValue._hex,
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      console.log('✅ ETH Tip Sent, TxHash:', txHash);

      // Log metadata
      await fetch(`${API_BASE}/api/tip`, {
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

      return { status: 'sent', id: txHash };
    }

    // ❌ Unsupported chain
    throw new Error(`Unsupported chain: ${chain}`);
  } catch (error) {
    console.error('❌ Error submitting tip:', error);
    throw error;
  }
}
