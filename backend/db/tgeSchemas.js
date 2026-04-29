const mongoose = require('mongoose');

// Liquidity Distribution Plan Schema
const liquidityDistributionPlanSchema = new mongoose.Schema({
  planId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  treasuryAllocation: { type: Number, required: true },
  allocatedAmount: { type: Number, default: 0 },
  pairs: [{
    dex: String,
    pairAddress: String,
    token0: String,
    token1: String,
    allocation: Number
  }],
  vesting: {
    enabled: { type: Boolean, default: false },
    duration: Number, // in seconds
    cliff: Number, // in seconds
    startTime: Date
  },
  schedule: {
    type: String,
    enum: ['immediate', 'scheduled'],
    default: 'immediate'
  },
  scheduledTime: Date,
  status: {
    type: String,
    enum: ['draft', 'pending', 'executing', 'completed', 'failed'],
    default: 'draft'
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Liquidity Distribution Execution History Schema
const liquidityDistributionExecutionSchema = new mongoose.Schema({
  planId: { type: String, required: true },
  executionId: { type: String, required: true, unique: true },
  isDryRun: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'failed'],
    default: 'started'
  },
  transactions: [{
    pairAddress: String,
    txHash: String,
    amount: Number,
    status: String,
    timestamp: Date,
    error: String
  }],
  totalDistributed: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  error: String
});

// Launch Pool Schema
const launchPoolSchema = new mongoose.Schema({
  poolId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  poolToken: { type: String, required: true },
  totalCap: { type: Number, required: true },
  currentDeposits: { type: Number, default: 0 },
  individualMax: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  allowlist: [String], // wallet addresses
  useAllowlist: { type: Boolean, default: false },
  rewardPolicy: {
    type: String,
    enum: ['proportional', 'fixed'],
    default: 'proportional'
  },
  rewardRate: Number, // tokens per contribution unit
  status: {
    type: String,
    enum: ['upcoming', 'active', 'closed', 'finalized'],
    default: 'upcoming'
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Launch Pool Deposit Schema
const launchPoolDepositSchema = new mongoose.Schema({
  poolId: { type: String, required: true },
  wallet: { type: String, required: true },
  amount: { type: Number, required: true },
  allocatedTokens: { type: Number, default: 0 },
  claimed: { type: Boolean, default: false },
  claimedAt: Date,
  depositedAt: { type: Date, default: Date.now }
});

// Create compound index for efficient queries
launchPoolDepositSchema.index({ poolId: 1, wallet: 1 }, { unique: true });
liquidityDistributionExecutionSchema.index({ planId: 1, executionId: 1 });

const LiquidityDistributionPlan = mongoose.model('LiquidityDistributionPlan', liquidityDistributionPlanSchema);
const LiquidityDistributionExecution = mongoose.model('LiquidityDistributionExecution', liquidityDistributionExecutionSchema);
const LaunchPool = mongoose.model('LaunchPool', launchPoolSchema);
const LaunchPoolDeposit = mongoose.model('LaunchPoolDeposit', launchPoolDepositSchema);

module.exports = {
  LiquidityDistributionPlan,
  LiquidityDistributionExecution,
  LaunchPool,
  LaunchPoolDeposit
};
