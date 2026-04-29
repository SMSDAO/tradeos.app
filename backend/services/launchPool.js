const { v4: uuidv4 } = require('uuid');
const { LaunchPool, LaunchPoolDeposit } = require('../db/tgeSchemas');
const Web3Integration = require('./web3Integration');

class LaunchPoolService {
  constructor() {
    this.web3 = new Web3Integration();
  }

  /**
   * Create a new launch pool
   * @param {Object} poolData - Pool configuration
   * @param {String} createdBy - Creator wallet address
   * @returns {Promise<Object>} - Created pool
   */
  async createPool(poolData, createdBy) {
    // Validate pool data
    const validation = this.validatePoolData(poolData);
    if (!validation.valid) {
      throw new Error(`Pool validation failed: ${validation.errors.join(', ')}`);
    }

    const poolId = poolData.poolId || uuidv4();
    const pool = new LaunchPool({
      poolId,
      name: poolData.name,
      poolToken: poolData.poolToken,
      totalCap: poolData.totalCap,
      individualMax: poolData.individualMax,
      startTime: new Date(poolData.startTime),
      endTime: new Date(poolData.endTime),
      allowlist: poolData.allowlist || [],
      useAllowlist: poolData.useAllowlist || false,
      rewardPolicy: poolData.rewardPolicy || 'proportional',
      rewardRate: poolData.rewardRate,
      status: 'upcoming',
      createdBy
    });

    await pool.save();
    console.log(`[LaunchPool] Pool created: ${poolId} by ${createdBy}`);
    return pool;
  }

  /**
   * Validate pool data
   * @param {Object} poolData - Pool data to validate
   * @returns {Object} - Validation result
   */
  validatePoolData(poolData) {
    const errors = [];

    if (!poolData.name) {
      errors.push('Pool name is required');
    }

    if (!poolData.poolToken) {
      errors.push('Pool token address is required');
    }

    if (!poolData.totalCap || poolData.totalCap <= 0) {
      errors.push('Total cap must be positive');
    }

    if (!poolData.individualMax || poolData.individualMax <= 0) {
      errors.push('Individual max must be positive');
    }

    if (poolData.individualMax > poolData.totalCap) {
      errors.push('Individual max cannot exceed total cap');
    }

    if (!poolData.startTime) {
      errors.push('Start time is required');
    }

    if (!poolData.endTime) {
      errors.push('End time is required');
    }

    if (poolData.startTime && poolData.endTime) {
      const start = new Date(poolData.startTime);
      const end = new Date(poolData.endTime);
      if (end <= start) {
        errors.push('End time must be after start time');
      }
    }

    if (poolData.useAllowlist && (!poolData.allowlist || poolData.allowlist.length === 0)) {
      errors.push('Allowlist must contain at least one address when enabled');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Deposit to a launch pool
   * @param {String} poolId - Pool ID
   * @param {String} wallet - User wallet address
   * @param {Number} amount - Deposit amount
   * @returns {Promise<Object>} - Deposit record
   */
  async deposit(poolId, wallet, amount) {
    const pool = await LaunchPool.findOne({ poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    // Update pool status based on time
    await this.updatePoolStatus(pool);

    // Validate deposit
    const validation = await this.validateDeposit(pool, wallet, amount);
    if (!validation.valid) {
      throw new Error(`Deposit validation failed: ${validation.errors.join(', ')}`);
    }

    // Use findOneAndUpdate with upsert to handle concurrent deposits atomically
    const deposit = await LaunchPoolDeposit.findOneAndUpdate(
      { poolId, wallet },
      { 
        $inc: { amount: amount },
        $setOnInsert: { 
          poolId, 
          wallet,
          allocatedTokens: 0,
          claimed: false
        }
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    );

    // Check if total exceeds individual max after update
    if (deposit.amount > pool.individualMax) {
      // Rollback by removing the added amount
      deposit.amount -= amount;
      await deposit.save();
      throw new Error(`Total deposit would exceed individual max of ${pool.individualMax}`);
    }
    
    console.log(`[LaunchPool] Deposit from ${wallet} in pool ${poolId}: ${amount} (total: ${deposit.amount})`);

    // Update pool current deposits
    pool.currentDeposits = await this.getTotalDeposits(poolId);
    await pool.save();

    return deposit;
  }

  /**
   * Validate a deposit
   * @param {Object} pool - Pool object
   * @param {String} wallet - User wallet
   * @param {Number} amount - Deposit amount
   * @returns {Object} - Validation result
   */
  async validateDeposit(pool, wallet, amount) {
    const errors = [];

    // Check pool status
    if (pool.status !== 'active') {
      errors.push(`Pool is not active (status: ${pool.status})`);
    }

    // Check time window
    const now = new Date();
    if (now < pool.startTime) {
      errors.push(`Pool has not started yet (starts at ${pool.startTime})`);
    }
    if (now > pool.endTime) {
      errors.push(`Pool has ended (ended at ${pool.endTime})`);
    }

    // Check allowlist
    if (pool.useAllowlist && !pool.allowlist.includes(wallet)) {
      errors.push('Wallet is not on the allowlist');
    }

    // Check amount
    if (amount <= 0) {
      errors.push('Amount must be positive');
    }

    // Check individual max
    const existingDeposit = await LaunchPoolDeposit.findOne({ poolId: pool.poolId, wallet });
    const currentAmount = existingDeposit ? existingDeposit.amount : 0;
    if (currentAmount + amount > pool.individualMax) {
      errors.push(`Deposit would exceed individual max of ${pool.individualMax}`);
    }

    // Check pool cap
    if (pool.currentDeposits + amount > pool.totalCap) {
      errors.push(`Deposit would exceed pool cap of ${pool.totalCap}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Finalize a pool and compute allocations
   * @param {String} poolId - Pool ID
   * @returns {Promise<Object>} - Finalization result
   */
  async finalizePool(poolId) {
    const pool = await LaunchPool.findOne({ poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    // Check if pool can be finalized
    const now = new Date();
    if (now < pool.endTime) {
      throw new Error(`Pool cannot be finalized before end time (${pool.endTime})`);
    }

    if (pool.status === 'finalized') {
      throw new Error('Pool is already finalized');
    }

    // Get all deposits
    const deposits = await LaunchPoolDeposit.find({ poolId });
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);

    console.log(`[LaunchPool] Finalizing pool ${poolId} with ${totalDeposits} total deposits`);

    // Compute allocations based on reward policy
    let totalAllocated = 0;
    for (const deposit of deposits) {
      let allocation = 0;
      
      if (pool.rewardPolicy === 'proportional') {
        // Proportional share of pool
        allocation = (deposit.amount / totalDeposits) * pool.totalCap;
      } else if (pool.rewardPolicy === 'fixed' && pool.rewardRate) {
        // Fixed rate reward
        allocation = deposit.amount * pool.rewardRate;
      }

      deposit.allocatedTokens = allocation;
      await deposit.save();
      totalAllocated += allocation;
      
      console.log(`[LaunchPool] Allocated ${allocation} tokens to ${deposit.wallet}`);
    }

    // Update pool status
    pool.status = 'finalized';
    pool.updatedAt = new Date();
    await pool.save();

    console.log(`[LaunchPool] Pool ${poolId} finalized. Total allocated: ${totalAllocated}`);

    return {
      poolId,
      totalDeposits,
      totalAllocated,
      depositCount: deposits.length,
      unfilledAmount: pool.totalCap - totalAllocated
    };
  }

  /**
   * Claim allocated tokens
   * @param {String} poolId - Pool ID
   * @param {String} wallet - User wallet
   * @param {Boolean} dryRun - Whether to simulate the claim
   * @returns {Promise<Object>} - Claim result
   */
  async claim(poolId, wallet, dryRun = false) {
    const pool = await LaunchPool.findOne({ poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    if (pool.status !== 'finalized') {
      throw new Error(`Pool is not finalized yet (status: ${pool.status})`);
    }

    const deposit = await LaunchPoolDeposit.findOne({ poolId, wallet });
    if (!deposit) {
      throw new Error(`No deposit found for wallet ${wallet} in pool ${poolId}`);
    }

    // Check for double-claim
    if (deposit.claimed) {
      throw new Error(`Tokens already claimed at ${deposit.claimedAt}`);
    }

    if (deposit.allocatedTokens <= 0) {
      throw new Error('No tokens allocated');
    }

    console.log(`[LaunchPool] ${dryRun ? 'Simulating' : 'Processing'} claim for ${wallet}: ${deposit.allocatedTokens} tokens`);

    // Execute token transfer
    const transferResult = await this.web3.transferTokens(
      wallet,
      pool.poolToken,
      deposit.allocatedTokens,
      dryRun
    );

    if (!dryRun) {
      // Mark as claimed
      deposit.claimed = true;
      deposit.claimedAt = new Date();
      await deposit.save();
      
      console.log(`[LaunchPool] Claim completed for ${wallet}: ${deposit.allocatedTokens} tokens`);
    }

    return {
      success: true,
      wallet,
      amount: deposit.allocatedTokens,
      txHash: transferResult.txHash,
      timestamp: transferResult.timestamp,
      simulated: dryRun
    };
  }

  /**
   * Get pool status
   * @param {String} poolId - Pool ID
   * @returns {Promise<Object>} - Pool status
   */
  async getPoolStatus(poolId) {
    const pool = await LaunchPool.findOne({ poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    // Update status based on current time
    await this.updatePoolStatus(pool);

    const deposits = await LaunchPoolDeposit.find({ poolId });
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
    const depositCount = deposits.length;
    const claimedCount = deposits.filter(d => d.claimed).length;

    const now = new Date();
    const timeToStart = pool.startTime > now ? pool.startTime - now : 0;
    const timeToEnd = pool.endTime > now ? pool.endTime - now : 0;

    return {
      pool,
      totalDeposits,
      depositCount,
      claimedCount,
      availableCapacity: pool.totalCap - totalDeposits,
      percentFilled: (totalDeposits / pool.totalCap) * 100,
      timeToStart,
      timeToEnd,
      isActive: pool.status === 'active',
      canDeposit: pool.status === 'active' && now >= pool.startTime && now <= pool.endTime,
      canFinalize: pool.status === 'closed' && now > pool.endTime,
      canClaim: pool.status === 'finalized'
    };
  }

  /**
   * Get user position in a pool
   * @param {String} poolId - Pool ID
   * @param {String} wallet - User wallet
   * @returns {Promise<Object>} - User position
   */
  async getUserPosition(poolId, wallet) {
    const pool = await LaunchPool.findOne({ poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    const deposit = await LaunchPoolDeposit.findOne({ poolId, wallet });
    
    if (!deposit) {
      return {
        wallet,
        hasDeposit: false,
        canDeposit: pool.status === 'active',
        isAllowlisted: !pool.useAllowlist || pool.allowlist.includes(wallet)
      };
    }

    const totalDeposits = await this.getTotalDeposits(poolId);
    const share = totalDeposits > 0 ? (deposit.amount / totalDeposits) * 100 : 0;

    return {
      wallet,
      hasDeposit: true,
      deposit: deposit.amount,
      allocated: deposit.allocatedTokens,
      claimed: deposit.claimed,
      claimedAt: deposit.claimedAt,
      share,
      canClaim: pool.status === 'finalized' && !deposit.claimed
    };
  }

  /**
   * Update pool status based on current time
   * @param {Object} pool - Pool object
   */
  async updatePoolStatus(pool) {
    const now = new Date();
    let updated = false;

    if (pool.status === 'upcoming' && now >= pool.startTime) {
      pool.status = 'active';
      updated = true;
    }

    if (pool.status === 'active' && now > pool.endTime) {
      pool.status = 'closed';
      updated = true;
    }

    if (updated) {
      pool.updatedAt = new Date();
      await pool.save();
      console.log(`[LaunchPool] Pool ${pool.poolId} status updated to ${pool.status}`);
    }

    return pool;
  }

  /**
   * Get total deposits for a pool
   * @param {String} poolId - Pool ID
   * @returns {Promise<Number>} - Total deposits
   */
  async getTotalDeposits(poolId) {
    const deposits = await LaunchPoolDeposit.find({ poolId });
    return deposits.reduce((sum, d) => sum + d.amount, 0);
  }

  /**
   * Return unfilled allocation to treasury
   * @param {String} poolId - Pool ID
   * @returns {Promise<Object>} - Return result
   */
  async returnUnfilledToTreasury(poolId) {
    const pool = await LaunchPool.findOne({ poolId });
    if (!pool) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    if (pool.status !== 'finalized') {
      throw new Error('Pool must be finalized first');
    }

    const deposits = await LaunchPoolDeposit.find({ poolId });
    const totalAllocated = deposits.reduce((sum, d) => sum + d.allocatedTokens, 0);
    const unfilledAmount = pool.totalCap - totalAllocated;

    if (unfilledAmount <= 0) {
      return {
        success: true,
        message: 'No unfilled allocation to return',
        unfilledAmount: 0
      };
    }

    console.log(`[LaunchPool] Returning ${unfilledAmount} unfilled tokens to treasury`);

    // In production, this would transfer tokens back to treasury
    // For now, we just log it
    
    return {
      success: true,
      unfilledAmount,
      message: `Returned ${unfilledAmount} tokens to treasury`
    };
  }
}

module.exports = LaunchPoolService;
