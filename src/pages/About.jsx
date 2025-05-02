import React from 'react';

export default function About() {
  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About StroviaX</h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        StroviaX is a next-generation micro-transaction tipping platform built on the XRP Ledger.
        It allows fans to support their favorite creators instantly, securely, and with zero network fees.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We believe in empowering creators through direct support from their audiences. By leveraging the speed and efficiency of the XRP Ledger, StroviaX offers a frictionless and transparent way to send value across the internet.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">What’s Next</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We're working on powerful features like analytics dashboards, multi-token support, and customizable tipping widgets — all with the goal of giving creators full ownership and freedom over their monetization.
        </p>
      </section>
    </div>
  );
}
