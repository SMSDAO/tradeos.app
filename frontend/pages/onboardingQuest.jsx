import React, { useState } from 'react';

export default function OnboardingQuest() {
  const [quests] = useState([
    'Connect wallet',
    'Explore dashboard',
    'Claim a badge',
    'Complete a swap',
  ]);

  return (
    <div>
      <h3>🚀 Onboarding Quest</h3>
      <ol>
        {quests.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ol>
    </div>
  );
}
