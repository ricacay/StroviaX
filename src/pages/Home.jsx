import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import useTipStore from '../store/useTipStore';
import useXaman from '../store/useXaman';
import submitTip from '../utils/submitTip';

import CreatorCard from '../components/CreatorCard';
import creators from '../data/creators';

export default function Home() {
  const navigate = useNavigate();

  const { tipper, amount, setTipper, setAmount, resetTip } = useTipStore();
  const { walletAddress, isAuthenticated, sendXrpTip } = useXaman();

  const [isSending, setIsSending] = useState(false);

  const handleSendTip = async () => {
    if (!tipper || !amount) {
      toast.error('Please fill in both fields.');
      return;
    }

    if (!isAuthenticated || !walletAddress) {
      toast.error('Connect your wallet to send a tip.');
      return;
    }

    setIsSending(true);

    try {
      await submitTip({ tipper, amount });
      const txResult = await sendXrpTip(walletAddress, amount);

      if (txResult) {
        toast.success(`🎉 Tip sent successfully! Thanks, ${tipper}!`);
        resetTip();
      } else {
        toast.error('Tip was not signed. No XRP sent.');
      }
    } catch (error) {
      toast.error('An error occurred while sending the tip.');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome to Strovia 🎉</h1>
      <p className="text-gray-700 mb-6">
        A micro-transaction tipping platform built on the XRP Ledger.
        Designed for fans who want to support creators instantly and fee-free.
      </p>

      <h2 className="text-xl font-semibold mb-4">Meet the Creators</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
        {creators.map((creator) => (
          <Link key={creator.id} to={`/creator/${creator.id}`}>
            <CreatorCard creator={creator} />
          </Link>
        ))}
      </div>

      <div className="mt-8 max-w-md">
        <input
          type="text"
          placeholder="Your name..."
          value={tipper}
          onChange={(e) => setTipper(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          placeholder="Tip amount (XRP)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleSendTip}
          disabled={isSending}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md transition ${
            isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isSending ? 'Sending...' : 'Send Tip'}
        </button>
      </div>
    </div>
  );
}
