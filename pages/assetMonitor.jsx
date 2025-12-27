import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssetMonitor() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    axios.get('/api/assets').then(res => {
      setAssets(res.data || []);
    });
  }, []);

  return (
    <div>
      <h3>📊 Asset Monitor</h3>
      <ul>
        {assets.map((a, i) => (
          <li key={i}>{a.symbol} — {a.balance}</li>
        ))}
      </ul>
    </div>
  );
}
