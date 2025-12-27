import React from 'react';
import Link from 'next/link';
import './Home.css'; // optional styling

export default function Home() {
  return (
    <div className='dashboard-container dark-theme'>
      <h1>🚀 Welcome to TradeOS V1.1</h1>
      <p>Your sovereign-grade automation dashboard across EVM, Solana, BASE, and more.</p>

      <ul>
        <li>🧠 Adaptive UI w/ chain glow logic</li>
        <li>🎁 Airdrop claim modules synced to GXQ scores</li>
        <li>🪙 Jackpot staking pools (ETH, SOL, BTC, GXQ)</li>
        <li>🔀 Arbitrage bots & wallet scoring flows</li>
      </ul>

      <Link href='/DashboardMain'>
        <button>💻 Launch Dashboard</button>
      </Link>
    </div>
  );
}
