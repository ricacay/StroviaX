import React from 'react';
import useChainStore from '../stores/chainStore';

export default function ChainSelector() {
  const { chain, setChain } = useChainStore();

  const chains = ['xrpl', 'ethereum', 'solana']; // expandable later

  return (
    <div className="mb-4">
      <label className="mr-2 font-semibold">Chain:</label>
      <select
        value={chain}
        onChange={(e) => setChain(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        {chains.map((c) => (
          <option key={c} value={c}>
            {c.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
