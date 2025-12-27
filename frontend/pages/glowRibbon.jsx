import React from 'react';

export default function GlowRibbon({ color = '#4caf50' }) {
  return (
    <div style={{
      height: '8px',
      width: '100%',
      background: color,
      boxShadow: `0 0 10px ${color}`,
      margin: '10px 0'
    }}>
    </div>
  );
}
