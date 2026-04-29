const { v4: uuidv4 } = require('uuid');
const { LiquidityDistributionPlan, LiquidityDistributionExecution } = require('../db/tgeSchemas');
const Web3Integration = require('./web3Integration');

class LiquidityDistributorService {
  constructor() {
    this.web3 = new Web3Integration();
  }

  /**
   * Validate a liquidity distribution plan
   * @param {Object} planData - The plan data to validate
   * @returns {Object} - Validation result
   */
  validatePlan(planData) {
    const errors = [];

    // Validate treasury allocation
    if (!planData.treasuryAllocation || planData.treasuryAllocation <= 0) {
      errors.push('Treasury allocation must be a positive number');
    }

    // Validate pairs
    if (!planData.pairs || !Array.isArray(planData.pairs) || planData.pairs.length === 0) {
      errors.push('At least one liquidity pair must be specified');
    }

    // Calculate total allocation across pairs
    let totalAllocation = 0;
    const maxAllocationPercentage = parseFloat(process.env.TGE_MAX_ALLOCATION_PERCENTAGE) || 100;

    if (planData.pairs) {
      planData.pairs.forEach((pair, index) => {
        if (!pair.dex || !pair.pairAddress || !pair.allocation) {
          errors.push(`Pair ${index + 1}: Missing required fields (dex, pairAddress, allocation)`);
        }
        if (pair.allocation <= 0) {
          errors.push(`Pair ${index + 1}: Allocation must be positive`);
        }
        totalAllocation += pair.allocation || 0;
      });
    }

    // Check for over-allocation
    if (totalAllocation > planData.treasuryAllocation * (maxAllocationPercentage / 100)) {
      errors.push(`Over-allocation detected: Total allocation (${totalAllocation}) exceeds treasury allocation (${planData.treasuryAllocation})`);
    }

    // Validate vesting configuration
    if (planData.vesting && planData.vesting.enabled) {
      if (!planData.vesting.duration || planData.vesting.duration <= 0) {
        errors.push('Vesting duration must be positive');
      }
      if (planData.vesting.cliff && planData.vesting.cliff > planData.vesting.duration) {
        errors.push('Cliff period cannot exceed vesting duration');
      }
    }

    // Validate schedule
    if (planData.schedule === 'scheduled' && !planData.scheduledTime) {
      errors.push('Scheduled time must be provided for scheduled execution');
    }

    return {
      valid: errors.length === 0,
      errors,
      totalAllocation
    };
  }

  /**
   * Create a new liquidity distribution plan
   * @param {Object} planData - The plan data
   * @param {String} createdBy - Wallet address of creator
   * @returns {Promise<Object>} - Created plan
   */
  async createPlan(planData, createdBy) {
    // Validate plan
    const validation = this.validatePlan(planData);
    if (!validation.valid) {
      throw new Error(`Plan validation failed: ${validation.errors.join(', ')}`);
    }

    // Create plan
    const planId = planData.planId || uuidv4();
    const plan = new LiquidityDistributionPlan({
      planId,
      name: planData.name,
      treasuryAllocation: planData.treasuryAllocation,
      allocatedAmount: validation.totalAllocation,
      pairs: planData.pairs,
      vesting: planData.vesting || { enabled: false },
      schedule: planData.schedule || 'immediate',
      scheduledTime: planData.scheduledTime,
      status: 'draft',
      createdBy
    });

    await plan.save();
    console.log(`[LiquidityDistributor] Plan created: ${planId} by ${createdBy}`);
    return plan;
  }

  /**
   * Update an existing distribution plan
   * @param {String} planId - Plan ID
   * @param {Object} updates - Updates to apply
   * @param {String} updatedBy - Wallet address of updater
   * @returns {Promise<Object>} - Updated plan
   */
  async updatePlan(planId, updates, updatedBy) {
    const plan = await LiquidityDistributionPlan.findOne({ planId });
    if (!plan) {
      throw new Error(`Plan not found: ${planId}`);
    }

    // Only allow updates to draft plans
    if (plan.status !== 'draft') {
      throw new Error(`Cannot update plan in status: ${plan.status}`);
    }

    // Merge updates and validate
    const updatedPlan = { ...plan.toObject(), ...updates };
    const validation = this.validatePlan(updatedPlan);
    if (!validation.valid) {
      throw new Error(`Plan validation failed: ${validation.errors.join(', ')}`);
    }

    // Apply updates
    Object.assign(plan, updates, {
      allocatedAmount: validation.totalAllocation,
      updatedAt: new Date()
    });

    await plan.save();
    console.log(`[LiquidityDistributor] Plan updated: ${planId} by ${updatedBy}`);
    return plan;
  }

  /**
   * Execute a distribution plan
   * @param {String} planId - Plan ID
   * @param {Boolean} dryRun - Whether this is a dry run
   * @returns {Promise<Object>} - Execution result
   */
  async executePlan(planId, dryRun = true) {
    const plan = await LiquidityDistributionPlan.findOne({ planId });
    if (!plan) {
      throw new Error(`Plan not found: ${planId}`);
    }

    // Check if scheduled execution time has arrived
    if (plan.schedule === 'scheduled' && plan.scheduledTime > new Date()) {
      throw new Error(`Plan is scheduled for ${plan.scheduledTime}, cannot execute yet`);
    }

    // Create execution record
    const executionId = uuidv4();
    const execution = new LiquidityDistributionExecution({
      planId,
      executionId,
      isDryRun: dryRun,
      status: 'started'
    });
    await execution.save();

    // Update plan status
    if (!dryRun) {
      plan.status = 'executing';
      await plan.save();
    }

    console.log(`[LiquidityDistributor] ${dryRun ? 'Dry-run' : 'Live'} execution started: ${executionId} for plan ${planId}`);

    try {
      execution.status = 'in_progress';
      await execution.save();

      const transactions = [];
      let totalDistributed = 0;

      // Execute distribution for each pair
      for (const pair of plan.pairs) {
        try {
          const result = await this.web3.distributeLiquidity(
            pair.pairAddress,
            pair.allocation,
            plan.vesting,
            dryRun
          );

          transactions.push({
            pairAddress: pair.pairAddress,
            txHash: result.txHash,
            amount: pair.allocation,
            status: 'success',
            timestamp: new Date()
          });

          totalDistributed += pair.allocation;
          console.log(`[LiquidityDistributor] Distributed ${pair.allocation} to ${pair.pairAddress} ${dryRun ? '(dry-run)' : ''}`);
        } catch (error) {
          transactions.push({
            pairAddress: pair.pairAddress,
            amount: pair.allocation,
            status: 'failed',
            timestamp: new Date(),
            error: error.message
          });
          console.error(`[LiquidityDistributor] Failed to distribute to ${pair.pairAddress}:`, error.message);
        }
      }

      // Update execution record
      execution.status = 'completed';
      execution.transactions = transactions;
      execution.totalDistributed = totalDistributed;
      execution.completedAt = new Date();
      await execution.save();

      // Update plan status
      if (!dryRun) {
        plan.status = 'completed';
        await plan.save();
      }

      console.log(`[LiquidityDistributor] Execution completed: ${executionId}`);
      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.completedAt = new Date();
      await execution.save();

      if (!dryRun) {
        plan.status = 'failed';
        await plan.save();
      }

      console.error(`[LiquidityDistributor] Execution failed: ${executionId}`, error);
      throw error;
    }
  }

  /**
   * Get execution status and history
   * @param {String} planId - Plan ID (optional)
   * @returns {Promise<Array>} - Execution history
   */
  async getExecutionHistory(planId = null) {
    const query = planId ? { planId } : {};
    const executions = await LiquidityDistributionExecution.find(query)
      .sort({ startedAt: -1 })
      .limit(100);
    return executions;
  }

  /**
   * Get plan status
   * @param {String} planId - Plan ID
   * @returns {Promise<Object>} - Plan with execution history
   */
  async getPlanStatus(planId) {
    const plan = await LiquidityDistributionPlan.findOne({ planId });
    if (!plan) {
      throw new Error(`Plan not found: ${planId}`);
    }

    const executions = await this.getExecutionHistory(planId);
    return {
      plan,
      executions
    };
  }
}

module.exports = LiquidityDistributorService;
