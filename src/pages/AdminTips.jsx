import React, { useEffect, useState } from 'react';

export default function AdminTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/tips');
        const data = await response.json();
        setTips(data);
      } catch (err) {
        console.error('❌ Failed to fetch tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💸 Tip Log (Admin Viewer)</h1>

      {loading ? (
        <p>Loading tips...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
                <th className="p-3">Sender</th>
                <th className="p-3">Recipient</th>
                <th className="p-3">Amount (XRP)</th>
                <th className="p-3">Memo</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{tip.sender}</td>
                  <td className="p-3 font-mono text-xs">{tip.recipient}</td>
                  <td className="p-3">{(parseFloat(tip.amount) / 1000000).toFixed(2)} XRP</td>
                  <td className="p-3">{tip.memo || '—'}</td>
                  <td className="p-3">{new Date(tip.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
