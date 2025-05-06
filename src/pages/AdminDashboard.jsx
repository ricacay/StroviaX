import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('30');
  const [adminKey, setAdminKey] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (adminKey === import.meta.env.VITE_ADMIN_TOKEN) {
      setAccessGranted(true);
    } else {
      alert('Incorrect admin token.');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://stroviax-production.up.railway.app/api/admin/tips');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessGranted) fetchStats();
  }, [accessGranted]);

  const exportTipsToCSV = (tips) => {
    if (!tips || tips.length === 0) return;

    const headers = ['Timestamp', 'Sender', 'Recipient', 'Amount (XRP)', 'Memo'];
    const rows = tips.map((tip) => [
      new Date(tip.timestamp).toLocaleString(),
      tip.sender,
      tip.recipient,
      (parseFloat(tip.amount) / 1_000_000).toFixed(2),
      `"${tip.memo || ''}"`,
    ]);

    const csvContent =
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stroviax_tips.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTips = stats?.recentTips?.filter((tip) => {
    if (filter === 'all') return true;
    const days = parseInt(filter);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(tip.timestamp) >= cutoff;
  });

  if (!accessGranted) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">🔐 Admin Access Required</h1>
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter admin token"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="p-6 text-lg">Loading stats...</div>;
  if (!stats) return <div className="p-6 text-red-600">Failed to load data.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📈 Admin Tip Dashboard</h1>
        <button
          onClick={() => exportTipsToCSV(filteredTips)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📤 Download CSV
        </button>
      </div>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filter Tips By:</label>
        <select
          className="border px-2 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="bg-purple-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold">💰 Total XRP Tipped</h2>
        <p className="text-2xl font-bold mt-2">{stats.totalXRP} XRP</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📊 Top Tippers</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topTippers}>
            <XAxis dataKey="sender" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalXRP" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🌟 Most Tipped Creators</h2>
        <ul className="space-y-1">
          {stats.topCreators.map((creator, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-mono">{creator.recipient}</span> —{' '}
              <span className="font-bold">{creator.totalXRP} XRP</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">🕓 Recent Tips</h2>
        <ul className="space-y-1 text-sm">
          {filteredTips.map((tip) => (
            <li key={tip._id}>
              {new Date(tip.timestamp).toLocaleString()} —{' '}
              <span className="font-mono">{tip.sender}</span> tipped{' '}
              <strong>{parseFloat(tip.amount) / 1_000_000} XRP</strong> to{' '}
              <span className="font-mono">{tip.recipient}</span>
              {tip.memo && <> — <em>"{tip.memo}"</em></>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
