/**
 * TradeOS Launch Pool Frame - Example Implementation
 * 
 * This is a simple example of integrating the TradeOS Launch Pool
 * into a Farcaster Frame using the Frames.js framework.
 * 
 * Install dependencies:
 *   npm install frames.js axios
 */

const { createFrames, Button } = require('frames.js/next');
const axios = require('axios');

const TRADEOS_API = 'https://api.tradeos.app';
const DEFAULT_POOL_ID = 'pool-1'; // Replace with your pool ID

// Create frames instance
const frames = createFrames();

/**
 * Fetch pool status from TradeOS API
 */
async function getPoolStatus(poolId) {
  try {
    const response = await axios.get(`${TRADEOS_API}/api/tge/pool/status/${poolId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch pool status:', error.message);
    return null;
  }
}

/**
 * Get user position in pool
 */
async function getUserPosition(poolId, wallet, token) {
  try {
    const response = await axios.get(
      `${TRADEOS_API}/api/tge/pool/user/${wallet}/${poolId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch user position:', error.message);
    return null;
  }
}

/**
 * Authenticate user and get JWT token
 */
async function authenticateUser(wallet) {
  try {
    const response = await axios.post(`${TRADEOS_API}/api/auth`, {
      wallet
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to authenticate:', error.message);
    return null;
  }
}

/**
 * Main frame handler - Display pool status
 */
const poolStatusFrame = frames(async (ctx) => {
  const poolId = ctx.searchParams?.poolId || DEFAULT_POOL_ID;
  const poolStatus = await getPoolStatus(poolId);

  if (!poolStatus) {
    return {
      image: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Error Loading Pool</h1>
          <p>Unable to fetch pool information</p>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">Retry</Button>
      ]
    };
  }

  const pool = poolStatus.pool;
  const percentFilled = poolStatus.percentFilled.toFixed(2);
  const timeRemaining = formatTimeRemaining(poolStatus.timeToEnd);

  return {
    image: (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '40px'
      }}>
        <h1>🚀 {pool.name}</h1>
        <div style={{ fontSize: '24px', marginTop: '20px' }}>
          <p>Cap: {pool.totalCap.toLocaleString()} tokens</p>
          <p>Filled: {percentFilled}%</p>
          <p>Status: {pool.status.toUpperCase()}</p>
          <p>Time Remaining: {timeRemaining}</p>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/deposit">Deposit</Button>,
      <Button action="post" target="/position">My Position</Button>,
      <Button action="link" target={`https://tradeos.app/pool/${poolId}`}>
        View on TradeOS
      </Button>
    ]
  };
});

/**
 * Deposit frame - Allow user to deposit
 */
const depositFrame = frames(async (ctx) => {
  const poolId = ctx.searchParams?.poolId || DEFAULT_POOL_ID;
  
  // On button press, process deposit
  if (ctx.message) {
    const wallet = ctx.message.verifiedWalletAddress;
    const amount = ctx.message.inputText;

    if (!wallet) {
      return {
        image: <div>Error: Wallet not verified</div>,
        buttons: [<Button action="post" target="/">Back</Button>]
      };
    }

    // Authenticate user
    const token = await authenticateUser(wallet);
    if (!token) {
      return {
        image: <div>Error: Authentication failed</div>,
        buttons: [<Button action="post" target="/">Back</Button>]
      };
    }

    // Process deposit
    try {
      const response = await axios.post(
        `${TRADEOS_API}/api/tge/pool/deposit`,
        {
          poolId,
          amount: parseFloat(amount)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return {
        image: (
          <div>
            <h1>✅ Deposit Successful!</h1>
            <p>Amount: {amount} tokens</p>
          </div>
        ),
        buttons: [
          <Button action="post" target="/">Back to Pool</Button>,
          <Button action="post" target="/position">View Position</Button>
        ]
      };
    } catch (error) {
      return {
        image: (
          <div>
            <h1>❌ Deposit Failed</h1>
            <p>{error.response?.data?.error || error.message}</p>
          </div>
        ),
        buttons: [<Button action="post" target="/deposit">Try Again</Button>]
      };
    }
  }

  // Show deposit form
  return {
    image: (
      <div>
        <h1>Deposit to Pool</h1>
        <p>Enter amount below</p>
      </div>
    ),
    textInput: 'Amount to deposit',
    buttons: [
      <Button action="post">Confirm Deposit</Button>,
      <Button action="post" target="/">Cancel</Button>
    ]
  };
});

/**
 * Position frame - Show user's position
 */
const positionFrame = frames(async (ctx) => {
  const poolId = ctx.searchParams?.poolId || DEFAULT_POOL_ID;
  
  if (!ctx.message?.verifiedWalletAddress) {
    return {
      image: <div>Please connect your wallet to view position</div>,
      buttons: [<Button action="post" target="/">Back</Button>]
    };
  }

  const wallet = ctx.message.verifiedWalletAddress;
  const token = await authenticateUser(wallet);
  
  if (!token) {
    return {
      image: <div>Error: Authentication failed</div>,
      buttons: [<Button action="post" target="/">Back</Button>]
    };
  }

  const position = await getUserPosition(poolId, wallet, token);

  if (!position || !position.hasDeposit) {
    return {
      image: (
        <div>
          <h1>No Position Yet</h1>
          <p>You haven't deposited to this pool</p>
        </div>
      ),
      buttons: [
        <Button action="post" target="/deposit">Make Deposit</Button>,
        <Button action="post" target="/">Back</Button>
      ]
    };
  }

  return {
    image: (
      <div>
        <h1>Your Position</h1>
        <p>Deposit: {position.deposit.toLocaleString()} tokens</p>
        <p>Share: {position.share.toFixed(4)}%</p>
        {position.allocated > 0 && (
          <p>Allocated: {position.allocated.toLocaleString()} tokens</p>
        )}
        {position.claimed && (
          <p>Status: ✅ Claimed</p>
        )}
      </div>
    ),
    buttons: [
      position.canClaim ? 
        <Button action="post" target="/claim">Claim Tokens</Button> :
        null,
      <Button action="post" target="/">Back to Pool</Button>
    ].filter(Boolean)
  };
});

/**
 * Claim frame - Allow user to claim tokens
 */
const claimFrame = frames(async (ctx) => {
  const poolId = ctx.searchParams?.poolId || DEFAULT_POOL_ID;
  
  if (!ctx.message?.verifiedWalletAddress) {
    return {
      image: <div>Please connect your wallet to claim</div>,
      buttons: [<Button action="post" target="/">Back</Button>]
    };
  }

  const wallet = ctx.message.verifiedWalletAddress;
  const token = await authenticateUser(wallet);

  if (!token) {
    return {
      image: <div>Error: Authentication failed</div>,
      buttons: [<Button action="post" target="/">Back</Button>]
    };
  }

  try {
    const response = await axios.post(
      `${TRADEOS_API}/api/tge/pool/claim`,
      {
        poolId,
        dryRun: false
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const result = response.data.data;

    return {
      image: (
        <div>
          <h1>✅ Claim Successful!</h1>
          <p>Amount: {result.amount.toLocaleString()} tokens</p>
          <p>TX: {result.txHash}</p>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">Back to Pool</Button>
      ]
    };
  } catch (error) {
    return {
      image: (
        <div>
          <h1>❌ Claim Failed</h1>
          <p>{error.response?.data?.error || error.message}</p>
        </div>
      ),
      buttons: [<Button action="post" target="/position">Back</Button>]
    };
  }
});

/**
 * Helper: Format time remaining
 */
function formatTimeRemaining(milliseconds) {
  if (milliseconds <= 0) return 'Ended';
  
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

// Export frame handlers
module.exports = {
  GET: poolStatusFrame,
  POST: poolStatusFrame,
  depositFrame,
  positionFrame,
  claimFrame
};
