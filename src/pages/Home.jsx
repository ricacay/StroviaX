import React from 'react';
import CreatorCard from '../components/CreatorCard';
import creators from '../data/creators';

export default function Home() {
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome to Strovia 🪙
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        A micro-transaction tipping platform built on the XRP Ledger.
        <br />
        Designed for fans who want to support creators instantly and fee-free.
      </p>

      <h2 className="text-xl font-semibold mb-4">Meet the Creators</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
        {creators.length > 0 ? (
          creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))
        ) : (
          <p className="text-gray-500">No creators available right now.</p>
        )}
      </div>
    </div>
  );
}
