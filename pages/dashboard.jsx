import React from 'react';
import BadgeExplorer from './badgeExplorer';
import AssetMonitor from './assetMonitor';
import Marketplace from './marketplace';

export default function Dashboard() {
  return (
    <div>
      <h2>📊 TradeOS Dashboard</h2>
      <BadgeExplorer />
      <AssetMonitor />
      <Marketplace />
    </div>
  );
}
