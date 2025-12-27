import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlashLoanDashboard from '../components/FlashLoanDashboard';
import ArbitragePanel from '../components/botWidgets/arbitragePanel';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>🔒 Admin Control Panel</h1>

      <section>
        <h2>1. User Roles & Freeze</h2>
        <ul>
          {users.map(u => (
            <li key={u.address}>
              {u.address} — Role: {u.role} — Frozen: {u.frozen.toString()}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>2. Flash Loan</h2>
        <FlashLoanDashboard />
      </section>

      <section>
        <h2>3. Arbitrage Bot</h2>
        <ArbitragePanel />
      </section>

      <section>
        <h2>4. Deploy & Audit</h2>
        <button onClick={()=>alert('Implement contract deploy flow')}>
          Deploy New Contract
        </button>
      </section>
    </div>
  );
}
