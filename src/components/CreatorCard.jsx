import React, { useState } from 'react';
import { submitTip } from '../utils/submitTip';
import useXamanAuth from '../hooks/useXamanAuth';
import { toast } from 'sonner';

export default function CreatorCard({ creator }) {
  const { isConnected, xrpAddress, xumm } = useXamanAuth(); // ✅ now includes xumm

  const [tipAmount, setTipAmount] = useState('5'); // Default 5 XRP
  const [tipHistory, setTipHistory] = useState([]);

  const handleTipClick = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first.');
      return;
    }

    const drops = (parseFloat(tipAmount) * 1000000).toString();
    const toastId = toast.loading('Sending tip...');

    try {
      await submitTip(xumm, creator.walletAddress, drops, `Tip for ${creator.name}`);
      toast.success('✅ Tip Sent! Thank you!', { id: toastId });

      const timestamp = new Date().toLocaleString();
      setTipHistory(prev => [
        { amount: tipAmount, timestamp },
        ...prev.slice(0, 4) // Limit to last 5
      ]);
    } catch (err) {
      toast.error('❌ Tip failed or cancelled.', { id: toastId });
      console.error('Tip error:', err);
    }
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
          <p className="font-semibold mb-1">Recent Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            {tipHistory.map((tip, index) => (
              <li key={index}>
                {tip.amount} XRP - <span className="text-gray-400">{tip.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
