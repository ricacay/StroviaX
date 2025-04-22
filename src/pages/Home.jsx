// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

import CreatorCard from '../components/CreatorCard';
import creators from '../data/creators';

export default function Home() {
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
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
}
