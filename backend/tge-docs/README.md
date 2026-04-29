# Treasury TGE (Token Generation Event) System

## Overview

The Treasury TGE system consists of two core components designed to manage token distribution during a Token Generation Event:

1. **Liquidity Distributor** - Orchestrates liquidity distribution to DEX pairs with vesting support
2. **Launch Pool** - Allows community participation in token allocation with proportional rewards

## Architecture

```
backend/
├── services/
│   ├── liquidityDistributor.js   # Liquidity distribution logic
│   ├── launchPool.js              # Launch pool management
│   └── web3Integration.js         # Web3/blockchain abstraction
├── api/
│   ├── tgeLiquidity.js            # Liquidity distributor API
│   └── tgePool.js                 # Launch pool API
└── db/
    └── tgeSchemas.js              # MongoDB schemas for TGE
```

### Database Schema

#### LiquidityDistributionPlan
- Stores distribution plans with treasury allocation, DEX pairs, vesting configuration
- Tracks plan status: draft, pending, executing, completed, failed

#### LiquidityDistributionExecution
- Records execution history for each plan
- Supports dry-run mode for testing
- Tracks individual transactions and their status

#### LaunchPool
- Pool configuration: token, cap, time window, allowlist
- Reward policy: proportional or fixed rate
- Status tracking: upcoming, active, closed, finalized

#### LaunchPoolDeposit
- User deposits with allocation tracking
- Claim status with reentrancy protection
- Compound index on poolId and wallet for efficient queries

## Configuration

### Environment Variables

See `.env.example` for all configuration options:

```bash
# Feature Flags
TGE_LIQUIDITY_DISTRIBUTOR_ENABLED=true
TGE_LAUNCH_POOL_ENABLED=true

# Safety
TGE_DRY_RUN_MODE=true  # Default to dry-run for safety

# Web3
WEB3_PROVIDER_URL=https://mainnet.infura.io/v3/YOUR_KEY
TREASURY_WALLET_ADDRESS=0x...

# Limits
TGE_MAX_ALLOCATION_PERCENTAGE=100
TGE_DEFAULT_POOL_CAP=1000000
TGE_DEFAULT_INDIVIDUAL_MAX=10000
```

### Feature Flags

- `TGE_LIQUIDITY_DISTRIBUTOR_ENABLED`: Enable/disable Liquidity Distributor APIs
- `TGE_LAUNCH_POOL_ENABLED`: Enable/disable Launch Pool APIs
- `TGE_DRY_RUN_MODE`: Force all executions to dry-run mode

## API Documentation

### Liquidity Distributor API

Base path: `/api/tge/liquidity`

#### POST /plan - Create/Update Distribution Plan

**Request:**
```json
{
  "planId": "optional-existing-plan-id",
  "name": "TGE Liquidity Distribution",
  "treasuryAllocation": 1000000,
  "pairs": [
    {
      "dex": "Uniswap V2",
      "pairAddress": "0x...",
      "token0": "0x...",
      "token1": "0x...",
      "allocation": 500000
    }
  ],
  "vesting": {
    "enabled": true,
    "duration": 7776000,
    "cliff": 2592000,
    "startTime": "2025-01-01T00:00:00Z"
  },
  "schedule": "immediate",
  "scheduledTime": null
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Plan object */ },
  "message": "Plan created successfully"
}
```

#### POST /execute - Execute Distribution Plan

**Request:**
```json
{
  "planId": "plan-uuid",
  "dryRun": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "exec-uuid",
    "isDryRun": true,
    "status": "completed",
    "transactions": [
      {
        "pairAddress": "0x...",
        "txHash": "0x...",
        "amount": 500000,
        "status": "success",
        "timestamp": "2025-12-27T..."
      }
    ],
    "totalDistributed": 500000
  }
}
```

#### GET /status/:planId - Get Plan Status

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": { /* Plan object */ },
    "executions": [ /* Execution history */ ]
  }
}
```

#### POST /validate - Validate Plan

**Request:** Same as /plan

**Response:**
```json
{
  "success": true,
  "validation": {
    "valid": true,
    "errors": [],
    "totalAllocation": 500000
  }
}
```

### Launch Pool API

Base path: `/api/tge/pool`

#### POST /create - Create Launch Pool

**Request:**
```json
{
  "name": "TradeOS TGE Launch Pool",
  "poolToken": "0x...",
  "totalCap": 1000000,
  "individualMax": 10000,
  "startTime": "2025-01-01T00:00:00Z",
  "endTime": "2025-01-07T00:00:00Z",
  "useAllowlist": false,
  "allowlist": [],
  "rewardPolicy": "proportional",
  "rewardRate": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Pool object */ },
  "message": "Launch pool created successfully"
}
```

#### POST /deposit - Deposit to Pool

**Request:**
```json
{
  "poolId": "pool-uuid",
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Deposit object */ },
  "message": "Deposit successful"
}
```

#### POST /claim - Claim Allocated Tokens

**Request:**
```json
{
  "poolId": "pool-uuid",
  "dryRun": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": "0x...",
    "amount": 6000,
    "txHash": "0x...",
    "timestamp": "2025-12-27T..."
  },
  "message": "Claim successful"
}
```

#### POST /finalize - Finalize Pool

**Request:**
```json
{
  "poolId": "pool-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "poolId": "pool-uuid",
    "totalDeposits": 800000,
    "totalAllocated": 1000000,
    "depositCount": 150,
    "unfilledAmount": 200000
  }
}
```

#### GET /status/:poolId - Get Pool Status

**Response:**
```json
{
  "success": true,
  "data": {
    "pool": { /* Pool object */ },
    "totalDeposits": 800000,
    "depositCount": 150,
    "claimedCount": 0,
    "availableCapacity": 200000,
    "percentFilled": 80,
    "timeToStart": 0,
    "timeToEnd": 86400000,
    "isActive": true,
    "canDeposit": true,
    "canFinalize": false,
    "canClaim": false
  }
}
```

#### GET /user/:wallet/:poolId - Get User Position

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": "0x...",
    "hasDeposit": true,
    "deposit": 5000,
    "allocated": 6250,
    "claimed": false,
    "share": 0.625,
    "canClaim": false
  }
}
```

## Operational Runbook

### Running a TGE with Liquidity Distribution

#### 1. Create Distribution Plan

```bash
# Authenticate first
curl -X POST https://api.tradeos.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0x..."}'
# Save the token from response

# Create plan
curl -X POST https://api.tradeos.app/api/tge/liquidity/plan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @liquidity-plan.json
```

#### 2. Validate Plan

```bash
curl -X POST https://api.tradeos.app/api/tge/liquidity/validate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @liquidity-plan.json
```

#### 3. Dry-Run Execution

```bash
curl -X POST https://api.tradeos.app/api/tge/liquidity/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "your-plan-id",
    "dryRun": true
  }'
```

#### 4. Live Execution

```bash
# Set TGE_DRY_RUN_MODE=false in production
curl -X POST https://api.tradeos.app/api/tge/liquidity/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "your-plan-id",
    "dryRun": false
  }'
```

#### 5. Monitor Execution

```bash
curl https://api.tradeos.app/api/tge/liquidity/status/your-plan-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Running a Launch Pool

#### 1. Create Pool

```bash
curl -X POST https://api.tradeos.app/api/tge/pool/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @pool-config.json
```

#### 2. Monitor Pool Status

```bash
# Public endpoint - no auth required
curl https://api.tradeos.app/api/tge/pool/status/your-pool-id
```

#### 3. Users Deposit (During Active Window)

```bash
curl -X POST https://api.tradeos.app/api/tge/pool/deposit \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poolId": "your-pool-id",
    "amount": 5000
  }'
```

#### 4. Finalize Pool (After End Time)

```bash
curl -X POST https://api.tradeos.app/api/tge/pool/finalize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poolId": "your-pool-id"
  }'
```

#### 5. Users Claim Tokens

```bash
curl -X POST https://api.tradeos.app/api/tge/pool/claim \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poolId": "your-pool-id",
    "dryRun": false
  }'
```

#### 6. Return Unfilled to Treasury

```bash
curl -X POST https://api.tradeos.app/api/tge/pool/return-unfilled \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poolId": "your-pool-id"
  }'
```

## Security Considerations

### Reentrancy Protection
- LaunchPool deposits use unique compound indexes to prevent duplicate entries
- Claim operations check and update claimed status atomically
- Double-claim attempts are rejected with clear error messages

### Over-Allocation Prevention
- Distribution plans validate total allocation against treasury allocation
- Maximum allocation percentage enforced via `TGE_MAX_ALLOCATION_PERCENTAGE`
- Plan updates only allowed in 'draft' status

### Authentication & Authorization
- All write operations require JWT authentication
- Users can only query their own positions unless admin
- Feature flags provide kill-switch for emergency disable

### Dry-Run Mode
- Default to dry-run mode via `TGE_DRY_RUN_MODE`
- Simulates all blockchain transactions
- Allows testing without risking real funds

### Logging
- All operations logged with timestamps and actors
- No secrets logged (wallet addresses are public data)
- Transaction hashes recorded for audit trail

## Monitoring

### Key Metrics to Monitor

1. **Liquidity Distribution**
   - Plan creation rate
   - Execution success/failure rate
   - Average distribution time
   - Total distributed per plan
   - Failed transactions per execution

2. **Launch Pool**
   - Pool participation rate
   - Average deposit size
   - Pool fill percentage
   - Claim rate after finalization
   - Failed claims

### Log Patterns

```bash
# Successful distribution
[LiquidityDistributor] Plan created: {planId} by {wallet}
[LiquidityDistributor] Dry-run execution started: {executionId}
[LiquidityDistributor] Distributed {amount} to {pair}
[LiquidityDistributor] Execution completed: {executionId}

# Successful pool operations
[LaunchPool] Pool created: {poolId} by {wallet}
[LaunchPool] New deposit from {wallet} in pool {poolId}: {amount}
[LaunchPool] Finalizing pool {poolId} with {total} total deposits
[LaunchPool] Allocated {amount} tokens to {wallet}
[LaunchPool] Claim completed for {wallet}: {amount} tokens
```

## Troubleshooting

### Common Issues

**Q: Plan validation fails with "Over-allocation detected"**
- Check that sum of pair allocations doesn't exceed treasuryAllocation
- Verify TGE_MAX_ALLOCATION_PERCENTAGE setting

**Q: Cannot execute plan - "scheduled for future time"**
- Plan has schedule='scheduled' with future scheduledTime
- Wait until scheduledTime or update plan

**Q: Deposit rejected - "Pool is not active"**
- Check current time is between startTime and endTime
- Pool status updates automatically based on time

**Q: Claim fails - "Tokens already claimed"**
- User has already claimed their allocation
- Check deposit.claimed and deposit.claimedAt

**Q: Web3 transactions failing**
- Verify WEB3_PROVIDER_URL is set correctly
- Check TREASURY_WALLET_ADDRESS is valid
- Ensure provider has sufficient funds for gas

## Future Enhancements

- Multi-chain support (Ethereum, BSC, Polygon, etc.)
- Automated scheduled executions via cron
- Email/webhook notifications for pool events
- Admin dashboard for TGE management
- Advanced vesting schedules (non-linear)
- Batch claim operations
- Pool templates for quick setup
