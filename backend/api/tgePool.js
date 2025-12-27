const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const LaunchPoolService = require('../services/launchPool');

const poolService = new LaunchPoolService();

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Feature flag check
const checkFeatureEnabled = (req, res, next) => {
  if (process.env.TGE_LAUNCH_POOL_ENABLED !== 'true') {
    return res.status(403).json({ 
      success: false, 
      error: 'Launch Pool feature is not enabled' 
    });
  }
  next();
};

// POST /api/tge/pool/create - Create a new launch pool
router.post('/create', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const poolData = req.body;
    const wallet = req.user.wallet;

    const pool = await poolService.createPool(poolData, wallet);

    res.json({ 
      success: true, 
      data: pool,
      message: 'Launch pool created successfully'
    });
  } catch (error) {
    console.error('[API] Pool creation error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tge/pool/deposit - Deposit to a launch pool
router.post('/deposit', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { poolId, amount } = req.body;
    const wallet = req.user.wallet;

    if (!poolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pool ID is required' 
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid amount is required' 
      });
    }

    const deposit = await poolService.deposit(poolId, wallet, amount);

    res.json({ 
      success: true, 
      data: deposit,
      message: 'Deposit successful'
    });
  } catch (error) {
    console.error('[API] Pool deposit error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tge/pool/claim - Claim allocated tokens
router.post('/claim', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { poolId, dryRun } = req.body;
    const wallet = req.user.wallet;

    if (!poolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pool ID is required' 
      });
    }

    const isDryRun = dryRun === true || process.env.TGE_DRY_RUN_MODE === 'true';
    const result = await poolService.claim(poolId, wallet, isDryRun);

    res.json({ 
      success: true, 
      data: result,
      message: isDryRun ? 'Claim simulation successful' : 'Claim successful'
    });
  } catch (error) {
    console.error('[API] Pool claim error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tge/pool/finalize - Finalize a pool and compute allocations
router.post('/finalize', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { poolId } = req.body;

    if (!poolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pool ID is required' 
      });
    }

    const result = await poolService.finalizePool(poolId);

    res.json({ 
      success: true, 
      data: result,
      message: 'Pool finalized successfully'
    });
  } catch (error) {
    console.error('[API] Pool finalize error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/tge/pool/status/:poolId - Get pool status
router.get('/status/:poolId', checkFeatureEnabled, async (req, res) => {
  try {
    const { poolId } = req.params;

    const status = await poolService.getPoolStatus(poolId);

    res.json({ 
      success: true, 
      data: status 
    });
  } catch (error) {
    console.error('[API] Pool status error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/tge/pool/user/:wallet/:poolId? - Get user position
router.get('/user/:wallet/:poolId?', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { wallet, poolId } = req.params;

    // Users can only query their own position unless they're admin
    if (req.user.wallet !== wallet && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: Can only query own position' 
      });
    }

    if (!poolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pool ID is required' 
      });
    }

    const position = await poolService.getUserPosition(poolId, wallet);

    res.json({ 
      success: true, 
      data: position 
    });
  } catch (error) {
    console.error('[API] User position error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tge/pool/return-unfilled - Return unfilled allocation to treasury
router.post('/return-unfilled', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { poolId } = req.body;

    if (!poolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pool ID is required' 
      });
    }

    const result = await poolService.returnUnfilledToTreasury(poolId);

    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('[API] Return unfilled error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
