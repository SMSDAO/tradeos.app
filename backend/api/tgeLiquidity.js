const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const LiquidityDistributorService = require('../services/liquidityDistributor');

const liquidityService = new LiquidityDistributorService();

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
  if (process.env.TGE_LIQUIDITY_DISTRIBUTOR_ENABLED !== 'true') {
    return res.status(403).json({ 
      success: false, 
      error: 'Liquidity Distributor feature is not enabled' 
    });
  }
  next();
};

// POST /api/tge/liquidity/plan - Create or update a distribution plan
router.post('/plan', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { planId, ...planData } = req.body;
    const wallet = req.user.wallet;

    let plan;
    if (planId) {
      // Update existing plan
      plan = await liquidityService.updatePlan(planId, planData, wallet);
    } else {
      // Create new plan
      plan = await liquidityService.createPlan(planData, wallet);
    }

    res.json({ 
      success: true, 
      data: plan,
      message: planId ? 'Plan updated successfully' : 'Plan created successfully'
    });
  } catch (error) {
    console.error('[API] Liquidity plan error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tge/liquidity/execute - Execute a distribution plan
router.post('/execute', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { planId, dryRun } = req.body;

    if (!planId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Plan ID is required' 
      });
    }

    // Prioritize global dry-run mode for safety
    const isDryRun = process.env.TGE_DRY_RUN_MODE === 'true' || dryRun !== false;

    const execution = await liquidityService.executePlan(planId, isDryRun);

    res.json({ 
      success: true, 
      data: execution,
      message: isDryRun ? 'Dry-run execution completed' : 'Execution completed'
    });
  } catch (error) {
    console.error('[API] Liquidity execution error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/tge/liquidity/status/:planId? - Get plan status and execution history
router.get('/status/:planId?', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const { planId } = req.params;

    if (planId) {
      // Get specific plan status
      const status = await liquidityService.getPlanStatus(planId);
      res.json({ 
        success: true, 
        data: status 
      });
    } else {
      // Get all execution history
      const history = await liquidityService.getExecutionHistory();
      res.json({ 
        success: true, 
        data: history 
      });
    }
  } catch (error) {
    console.error('[API] Liquidity status error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tge/liquidity/validate - Validate a plan without saving
router.post('/validate', authenticate, checkFeatureEnabled, async (req, res) => {
  try {
    const planData = req.body;
    const validation = liquidityService.validatePlan(planData);

    res.json({ 
      success: true, 
      validation 
    });
  } catch (error) {
    console.error('[API] Liquidity validation error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
