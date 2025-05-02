import React, { useEffect, useState } from 'react';

export default function AdminTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/tips`);
        const data = await response.json();
        setTips(data);
      } catch (error) {
        console.error('Error fetching tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin: Recent Tips</h1>

      {loading ? (
        <p className="text-gray-500">Loading tips...</p>
      ) : tips.length === 0 ? (
        <p className="text-gray-500">No tips found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 text-sm font-semibold">Sender</th>
                <th className="text-left p-3 text-sm font-semibold">Recipient</th>
                <th className="text-left p-3 text-sm font-semibold">Amount (XRP)</th>
                <th className="text-left p-3 text-sm font-semibold">Memo</th>
                <th className="text-left p-3 text-sm font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-mono text-xs truncate max-w-[160px]">{tip.sender}</td>
                  <td className="p-3 font-mono text-xs truncate max-w-[160px]">{tip.recipient}</td>
                  <td className="p-3">{(parseInt(tip.amount, 10) / 1_000_000).toFixed(2)}</td>
                  <td className="p-3">{tip.memo || '-'}</td>
                  <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tip.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
