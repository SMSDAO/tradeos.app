import React, { useEffect, useState } from 'react';

export default function JackpotBadgeExplorer() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // 🚦 Replace with actual API or GraphQL call
    setBadges([
      { wallet: 'gxqstudio.eth', score: 99, role: 'Protocol Architect' },
      { wallet: '0x2AeF...a1B9', score: 84, role: 'UI Contributor' },
      { wallet: 'D4JvG7...pkin', score: 100, role: 'Value Maker' }
    ]);
  }, []);

  return (
    <div className='widget-card'>
      <h3>🏅 Jackpot Badge Explorer</h3>
      <ul>
        {badges.map((b, i) => (
          <li key={i}>
            <strong>{b.wallet}</strong> — {b.role} ({b.score}/100)
          </li>
        ))}
      </ul>
    </div>
  );
}
