import React, { useEffect, useState } from 'react';
import { submitTip } from '../utils/submitTip';
import useXamanAuth from '../hooks/useXamanAuth';
import { toast } from 'sonner';

export default function CreatorCard({ creator }) {
  const { isConnected, xrpAddress, error } = useXamanAuth();

  const [tipAmount, setTipAmount] = useState('5');
  const [tipHistory, setTipHistory] = useState([]);

  const historyKey = `tipHistory-${creator.address}`;

  useEffect(() => {
    const stored = localStorage.getItem(historyKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTipHistory(parsed);
      } catch {
        localStorage.removeItem(historyKey);
      }
    }
  }, [creator.address]);

  const handleTipClick = async () => {
    if (!isConnected) {
      toast.error('🔐 Please connect your wallet before tipping.');
      return;
    }

    const numericAmount = parseFloat(tipAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('❌ Please enter a valid tip amount greater than 0.');
      return;
    }

    if (!creator.address) {
      toast.error('❌ Creator wallet address not available.');
      return;
    }

    if (xrpAddress && creator.address === xrpAddress) {
      toast.error('🙅 You cannot tip yourself.');
      return;
    }

    const drops = (numericAmount * 1_000_000).toString();
    const toastId = toast.loading('Sending tip...');

    try {
      await submitTip(
        creator.address,
        drops,
        `Tip for ${creator.name}`,
        xrpAddress || 'anonymous'
      );

      toast.success('✅ Tip Sent! Thank you!', { id: toastId });

      const timestamp = new Date().toLocaleString();
      const newHistory = [
        { amount: tipAmount, timestamp },
        ...tipHistory.slice(0, 4)
      ];

      setTipHistory(newHistory);
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
    } catch (err) {
      toast.error('❌ Tip failed or was cancelled.', { id: toastId });
      console.error('Tip error:', err);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(historyKey);
    setTipHistory([]);
    toast.success('🧹 Tip history cleared.');
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition p-4 flex flex-col space-y-3">
      <img
        src={creator.image}
        alt={`${creator.name}'s avatar`}
        className="w-full h-48 object-cover rounded"
      />
      <div>
        <h3 className="text-lg font-semibold">{creator.name}</h3>
        <p className="text-sm text-gray-600">{creator.description}</p>
      </div>

      {/* Tip Input */}
      <div className="flex items-center space-x-2">
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
          className="w-20 px-2 py-1 border rounded text-sm"
        />
        <span className="text-sm font-medium text-gray-700">XRP</span>
      </div>

      {/* Send Tip Button */}
      <button
        onClick={handleTipClick}
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
      >
        💸 Send Tip
      </button>

      {/* Tip History */}
      {tipHistory.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Recent Tips:</p>
            <button
              onClick={handleClearHistory}
              className="text-red-500 text-xs underline hover:text-red-600"
            >
              Clear History
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {tipHistory.map((tip, index) => (
              <li key={index}>
                {tip.amount} XRP — <span className="text-gray-400">{tip.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional Wallet Error Display */}
      {error && (
        <p className="text-xs text-red-500 mt-2">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
