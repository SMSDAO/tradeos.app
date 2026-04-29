# Frames Builder Integration Guide

## Overview

This guide explains how Frames builders can integrate the TradeOS Launch Pool into their frames, allowing users to participate in token launches directly within Farcaster frames.

## What are Frames?

Frames are interactive mini-applications that run inside Farcaster (a decentralized social network). They allow users to interact with web3 applications without leaving the social feed.

## Launch Pool Frame Integration

### Integration Methods

#### Method 1: Direct API Integration

Frames can directly call the TradeOS Launch Pool API to display pool information and process user actions.

**Example Frame Flow:**

1. **Display Pool Status** - Show pool information
2. **Deposit Button** - Allow user to deposit
3. **Confirmation** - Show deposit confirmation
4. **Position Display** - Show user's position

#### Method 2: Frame SDK (Coming Soon)

We're developing a TypeScript SDK specifically for Frames builders that will simplify integration.

### API Endpoints for Frames

All endpoints are available at: `https://api.tradeos.app/api/tge/pool`

#### Public Endpoints (No Auth Required)

- `GET /status/:poolId` - Get pool status and statistics

#### Authenticated Endpoints

For user-specific actions, frames must obtain a JWT token by calling:
- `POST /api/auth` with user's wallet address

Then use the token in `Authorization: Bearer <token>` header for:
- `POST /deposit` - User deposits to pool
- `POST /claim` - User claims tokens
- `GET /user/:wallet/:poolId` - Get user's position

### Example Frame Implementation

See `examples/launchPoolFrame.js` for a complete working example using the Frames.js framework.

## Frame Metadata

When creating a Frame that displays a Launch Pool, use these metadata tags:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://your-domain.com/pool-image.png" />
<meta property="fc:frame:button:1" content="View Pool" />
<meta property="fc:frame:button:1:action" content="post" />
<meta property="fc:frame:post_url" content="https://your-domain.com/api/frame/pool-action" />
```

## Security Considerations

### Wallet Verification

Always verify that the wallet address in the frame interaction matches the authenticated user:

```javascript
// Verify frame signature
const isValid = await verifyFrameSignature(frameData);
if (!isValid) {
  throw new Error('Invalid frame signature');
}

// Extract wallet address from frame
const wallet = frameData.interactor.wallet;

// Use this wallet for API calls
```

### Transaction Safety

- Always show users a confirmation before deposits
- Display clear error messages for failed operations
- Use dry-run mode for testing your frame

## Rate Limiting

Frame endpoints are rate-limited to prevent abuse:
- 10 requests per minute per wallet for authenticated endpoints
- 100 requests per minute per IP for public endpoints

## Testing Your Frame

### Local Testing

1. Set up a local frame preview environment
2. Use the TradeOS staging API: `https://staging-api.tradeos.app`
3. Test with dry-run mode enabled

### Frame Validator

Use the Farcaster Frame Validator to test your frame:
https://warpcast.com/~/developers/frames

## Support

For Frames integration support:
- Discord: https://discord.gg/tradeos
- Email: frames@tradeos.app
- Documentation: https://docs.tradeos.app/frames

## Example Use Cases

### 1. Simple Pool Display Frame
Show pool statistics with a "View on TradeOS" button

### 2. Interactive Deposit Frame
Allow users to deposit directly from the frame with amount selection

### 3. Claim Notification Frame
Notify users when they can claim tokens with a one-click claim button

### 4. Pool Leaderboard Frame
Display top participants with their deposit amounts and shares

## Best Practices

1. **Keep frames simple** - Focus on one action per frame
2. **Show clear feedback** - Always confirm actions visually
3. **Handle errors gracefully** - Display user-friendly error messages
4. **Test thoroughly** - Test all error cases and edge conditions
5. **Cache pool data** - Cache pool status for better performance
6. **Update regularly** - Keep pool status fresh with countdown timers

## Coming Soon

- Frame SDK with TypeScript support
- Pre-built frame templates
- Frame analytics dashboard
- Webhook notifications for frame builders
- Multi-pool frame support
