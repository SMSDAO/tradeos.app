/**
 * Test suite for Liquidity Distributor Service
 * 
 * Run with: node backend/tests/liquidityDistributor.test.js
 */

const LiquidityDistributorService = require('../services/liquidityDistributor');

// Mock console to reduce noise
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

function setupTests() {
  console.log = () => {};
  console.error = () => {};
}

function teardownTests() {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}

// Test helpers
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertTrue(condition, message) {
  assert(condition === true, message);
}

function assertFalse(condition, message) {
  assert(condition === false, message);
}

// Test suite
async function runTests() {
  setupTests();
  
  let passed = 0;
  let failed = 0;
  const errors = [];

  console.log = originalConsoleLog;
  console.log('\n🧪 Running Liquidity Distributor Tests...\n');
  console.log = () => {};

  // Test 1: Validate plan with correct data
  try {
    console.log = originalConsoleLog;
    console.log('Test 1: Validate plan with correct data...');
    console.log = () => {};

    const service = new LiquidityDistributorService();
    const planData = {
      name: 'Test Plan',
      treasuryAllocation: 1000000,
      pairs: [
        {
          dex: 'Uniswap V2',
          pairAddress: '0x1234567890123456789012345678901234567890',
          allocation: 500000
        }
      ]
    };

    const validation = service.validatePlan(planData);
    assertTrue(validation.valid, 'Plan should be valid');
    assertEquals(validation.errors.length, 0, 'Should have no errors');
    assertEquals(validation.totalAllocation, 500000, 'Total allocation should match');

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 1 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 1', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 1 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Test 2: Detect over-allocation
  try {
    console.log = originalConsoleLog;
    console.log('Test 2: Detect over-allocation...');
    console.log = () => {};

    const service = new LiquidityDistributorService();
    const planData = {
      name: 'Test Plan',
      treasuryAllocation: 1000000,
      pairs: [
        {
          dex: 'Uniswap V2',
          pairAddress: '0x1234567890123456789012345678901234567890',
          allocation: 800000
        },
        {
          dex: 'SushiSwap',
          pairAddress: '0x0987654321098765432109876543210987654321',
          allocation: 400000
        }
      ]
    };

    const validation = service.validatePlan(planData);
    assertFalse(validation.valid, 'Plan should be invalid due to over-allocation');
    assertTrue(validation.errors.length > 0, 'Should have errors');
    assertTrue(
      validation.errors.some(e => e.includes('Over-allocation')),
      'Should have over-allocation error'
    );

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 2 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 2', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 2 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Test 3: Reject empty pairs
  try {
    console.log = originalConsoleLog;
    console.log('Test 3: Reject empty pairs...');
    console.log = () => {};

    const service = new LiquidityDistributorService();
    const planData = {
      name: 'Test Plan',
      treasuryAllocation: 1000000,
      pairs: []
    };

    const validation = service.validatePlan(planData);
    assertFalse(validation.valid, 'Plan should be invalid with empty pairs');
    assertTrue(
      validation.errors.some(e => e.includes('At least one liquidity pair')),
      'Should have empty pairs error'
    );

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 3 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 3', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 3 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Test 4: Validate vesting configuration
  try {
    console.log = originalConsoleLog;
    console.log('Test 4: Validate vesting configuration...');
    console.log = () => {};

    const service = new LiquidityDistributorService();
    const planData = {
      name: 'Test Plan',
      treasuryAllocation: 1000000,
      pairs: [
        {
          dex: 'Uniswap V2',
          pairAddress: '0x1234567890123456789012345678901234567890',
          allocation: 500000
        }
      ],
      vesting: {
        enabled: true,
        duration: 7776000,
        cliff: 2592000
      }
    };

    const validation = service.validatePlan(planData);
    assertTrue(validation.valid, 'Plan with valid vesting should be valid');
    assertEquals(validation.errors.length, 0, 'Should have no errors');

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 4 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 4', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 4 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Test 5: Reject cliff greater than duration
  try {
    console.log = originalConsoleLog;
    console.log('Test 5: Reject cliff greater than duration...');
    console.log = () => {};

    const service = new LiquidityDistributorService();
    const planData = {
      name: 'Test Plan',
      treasuryAllocation: 1000000,
      pairs: [
        {
          dex: 'Uniswap V2',
          pairAddress: '0x1234567890123456789012345678901234567890',
          allocation: 500000
        }
      ],
      vesting: {
        enabled: true,
        duration: 2592000,
        cliff: 7776000
      }
    };

    const validation = service.validatePlan(planData);
    assertFalse(validation.valid, 'Plan should be invalid with cliff > duration');
    assertTrue(
      validation.errors.some(e => e.includes('Cliff period cannot exceed vesting duration')),
      'Should have cliff validation error'
    );

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 5 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 5', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 5 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Test 6: Validate scheduled execution requires time
  try {
    console.log = originalConsoleLog;
    console.log('Test 6: Validate scheduled execution requires time...');
    console.log = () => {};

    const service = new LiquidityDistributorService();
    const planData = {
      name: 'Test Plan',
      treasuryAllocation: 1000000,
      pairs: [
        {
          dex: 'Uniswap V2',
          pairAddress: '0x1234567890123456789012345678901234567890',
          allocation: 500000
        }
      ],
      schedule: 'scheduled'
    };

    const validation = service.validatePlan(planData);
    assertFalse(validation.valid, 'Plan should be invalid without scheduled time');
    assertTrue(
      validation.errors.some(e => e.includes('Scheduled time must be provided')),
      'Should have scheduled time error'
    );

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 6 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 6', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 6 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Print summary
  teardownTests();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (errors.length > 0) {
    console.log('Failed tests:');
    errors.forEach(({ test, error }) => {
      console.log(`  ${test}: ${error}`);
    });
    console.log('');
    process.exit(1);
  }

  return { passed, failed };
}

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
