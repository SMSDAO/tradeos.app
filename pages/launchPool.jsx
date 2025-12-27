import React, { useState, useEffect } from 'react';

export default function LaunchPool() {
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock pool data - in production, this would fetch from API
  useEffect(() => {
    // Simulate fetching pools
    const mockPools = [
      {
        poolId: 'pool-1',
        name: 'TradeOS TGE Launch Pool',
        poolToken: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        totalCap: 1000000,
        currentDeposits: 450000,
        individualMax: 10000,
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endTime: new Date(Date.now() + 86400000), // 24 hours from now
        status: 'active',
        rewardPolicy: 'proportional'
      }
    ];
    setPools(mockPools);
    setSelectedPool(mockPools[0]);
  }, []);

  const handleDeposit = async () => {
    setError('');
    setSuccess('');
    
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedPool) {
      setError('No pool selected');
      return;
    }

    setLoading(true);
    
    // In production, this would call the API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Successfully deposited ${depositAmount} tokens!`);
      setDepositAmount('');
      
      // TODO: In production, replace this client-side state update with an API call
      // to fetch the updated pool status from the server to ensure data consistency
      const updatedCurrentDeposits = selectedPool.currentDeposits + parseFloat(depositAmount);
      setSelectedPool({
        ...selectedPool,
        currentDeposits: updatedCurrentDeposits
      });
    } catch (err) {
      setError('Deposit failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Successfully claimed tokens!');
    } catch (err) {
      setError('Claim failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = date - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getPoolProgress = (pool) => {
    return Math.min((pool.currentDeposits / pool.totalCap) * 100, 100);
  };

  if (!selectedPool) {
    return (
      <div style={styles.container}>
        <h2>🚀 Launch Pool</h2>
        <p>Loading pools...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>🚀 Launch Pool</h2>
      
      {/* Pool Status Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3>{selectedPool.name}</h3>
          <span style={{
            ...styles.badge,
            backgroundColor: selectedPool.status === 'active' ? '#4CAF50' : '#FFC107'
          }}>
            {selectedPool.status.toUpperCase()}
          </span>
        </div>
        
        <div style={styles.cardBody}>
          {/* Pool Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Total Cap</div>
              <div style={styles.statValue}>{selectedPool.totalCap.toLocaleString()}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Current Deposits</div>
              <div style={styles.statValue}>{selectedPool.currentDeposits.toLocaleString()}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Individual Max</div>
              <div style={styles.statValue}>{selectedPool.individualMax.toLocaleString()}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Time Remaining</div>
              <div style={styles.statValue}>{formatTime(selectedPool.endTime)}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={styles.progressLabel}>
              Pool Progress: {getPoolProgress(selectedPool).toFixed(2)}%
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${getPoolProgress(selectedPool)}%`
                }}
              />
            </div>
          </div>

          {/* Countdown Timer */}
          {selectedPool.status === 'active' && (
            <div style={styles.countdown}>
              <div style={styles.countdownLabel}>⏰ Pool closes in:</div>
              <div style={styles.countdownValue}>{formatTime(selectedPool.endTime)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Section */}
      {selectedPool.status === 'active' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>Make a Deposit</h3>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount to Deposit</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                style={styles.input}
                disabled={loading}
                min="0"
                max={selectedPool.individualMax}
              />
              <div style={styles.inputHint}>
                Maximum: {selectedPool.individualMax.toLocaleString()} tokens
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <button
              onClick={handleDeposit}
              disabled={loading || !depositAmount}
              style={{
                ...styles.button,
                opacity: (loading || !depositAmount) ? 0.6 : 1
              }}
            >
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>
      )}

      {/* User Position Section */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3>Your Position</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.statsGrid}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Your Deposit</div>
              <div style={styles.statValue}>0</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Pool Share</div>
              <div style={styles.statValue}>0%</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Allocated Tokens</div>
              <div style={styles.statValue}>0</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Claim Status</div>
              <div style={styles.statValue}>Not Eligible</div>
            </div>
          </div>

          {selectedPool.status === 'finalized' && (
            <button
              onClick={handleClaim}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                marginTop: '20px'
              }}
            >
              {loading ? 'Processing...' : 'Claim Tokens'}
            </button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div style={styles.infoBox}>
        <h4>ℹ️ How it works:</h4>
        <ul style={styles.infoList}>
          <li>Deposit tokens during the active pool period</li>
          <li>Your allocation is proportional to your share of the pool</li>
          <li>Claim your tokens after the pool is finalized</li>
          <li>Unfilled allocations return to the treasury</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #333'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #333',
    paddingBottom: '15px'
  },
  cardBody: {
    color: '#ddd'
  },
  badge: {
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  stat: {
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  progressContainer: {
    marginTop: '20px'
  },
  progressLabel: {
    fontSize: '14px',
    marginBottom: '8px',
    color: '#ddd'
  },
  progressBar: {
    width: '100%',
    height: '30px',
    backgroundColor: '#333',
    borderRadius: '15px',
    overflow: 'hidden',
    position: 'relative'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease',
    borderRadius: '15px'
  },
  countdown: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    textAlign: 'center'
  },
  countdownLabel: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '5px'
  },
  countdownValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#FFC107'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#ddd'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    boxSizing: 'border-box'
  },
  inputHint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px'
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  error: {
    padding: '12px',
    marginBottom: '15px',
    backgroundColor: '#f44336',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '14px'
  },
  success: {
    padding: '12px',
    marginBottom: '15px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '14px'
  },
  infoBox: {
    backgroundColor: '#1a3a4a',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px',
    border: '1px solid #2a5a6a'
  },
  infoList: {
    marginLeft: '20px',
    color: '#ddd',
    lineHeight: '1.8'
  }
};
