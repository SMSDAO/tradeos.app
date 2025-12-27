/**
 * Test suite for Launch Pool Service
 * 
 * Run with: node backend/tests/launchPool.test.js
 */

const LaunchPoolService = require('../services/launchPool');

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
  console.log('\n🧪 Running Launch Pool Tests...\n');
  console.log = () => {};

  // Test 1: Validate pool with correct data
  try {
    console.log = originalConsoleLog;
    console.log('Test 1: Validate pool with correct data...');
    console.log = () => {};

    const service = new LaunchPoolService();
    const poolData = {
      name: 'Test Pool',
      poolToken: '0x1234567890123456789012345678901234567890',
      totalCap: 1000000,
      individualMax: 10000,
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 86400000),
      useAllowlist: false
    };

    const validation = service.validatePoolData(poolData);
    assertTrue(validation.valid, 'Pool should be valid');
    assertEquals(validation.errors.length, 0, 'Should have no errors');

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

  // Test 2: Reject individual max exceeding cap
  try {
    console.log = originalConsoleLog;
    console.log('Test 2: Reject individual max exceeding cap...');
    console.log = () => {};

    const service = new LaunchPoolService();
    const poolData = {
      name: 'Test Pool',
      poolToken: '0x1234567890123456789012345678901234567890',
      totalCap: 1000000,
      individualMax: 2000000,
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 86400000),
      useAllowlist: false
    };

    const validation = service.validatePoolData(poolData);
    assertFalse(validation.valid, 'Pool should be invalid');
    assertTrue(
      validation.errors.some(e => e.includes('Individual max cannot exceed total cap')),
      'Should have individual max error'
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

  // Test 3: Reject end time before start time
  try {
    console.log = originalConsoleLog;
    console.log('Test 3: Reject end time before start time...');
    console.log = () => {};

    const service = new LaunchPoolService();
    const poolData = {
      name: 'Test Pool',
      poolToken: '0x1234567890123456789012345678901234567890',
      totalCap: 1000000,
      individualMax: 10000,
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 3600000),
      useAllowlist: false
    };

    const validation = service.validatePoolData(poolData);
    assertFalse(validation.valid, 'Pool should be invalid');
    assertTrue(
      validation.errors.some(e => e.includes('End time must be after start time')),
      'Should have time validation error'
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

  // Test 4: Require allowlist when enabled
  try {
    console.log = originalConsoleLog;
    console.log('Test 4: Require allowlist when enabled...');
    console.log = () => {};

    const service = new LaunchPoolService();
    const poolData = {
      name: 'Test Pool',
      poolToken: '0x1234567890123456789012345678901234567890',
      totalCap: 1000000,
      individualMax: 10000,
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 86400000),
      useAllowlist: true,
      allowlist: []
    };

    const validation = service.validatePoolData(poolData);
    assertFalse(validation.valid, 'Pool should be invalid');
    assertTrue(
      validation.errors.some(e => e.includes('Allowlist must contain at least one address')),
      'Should have allowlist error'
    );

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

  // Test 5: Allocation math - proportional distribution
  try {
    console.log = originalConsoleLog;
    console.log('Test 5: Test allocation math for proportional distribution...');
    console.log = () => {};

    // Simulate proportional allocation calculation
    const totalCap = 1000000;
    const deposits = [
      { wallet: '0xA', amount: 5000 },
      { wallet: '0xB', amount: 3000 },
      { wallet: '0xC', amount: 2000 }
    ];
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);

    // Calculate allocations
    const allocations = deposits.map(d => ({
      wallet: d.wallet,
      allocation: (d.amount / totalDeposits) * totalCap
    }));

    // Verify
    assertEquals(allocations[0].allocation, 500000, 'Wallet A should get 50%');
    assertEquals(allocations[1].allocation, 300000, 'Wallet B should get 30%');
    assertEquals(allocations[2].allocation, 200000, 'Wallet C should get 20%');

    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocation, 0);
    assertEquals(totalAllocated, totalCap, 'Total allocated should equal cap');

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

  // Test 6: Allocation math - edge case with single depositor
  try {
    console.log = originalConsoleLog;
    console.log('Test 6: Test allocation math with single depositor...');
    console.log = () => {};

    const totalCap = 1000000;
    const deposits = [
      { wallet: '0xA', amount: 5000 }
    ];
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);

    const allocations = deposits.map(d => ({
      wallet: d.wallet,
      allocation: (d.amount / totalDeposits) * totalCap
    }));

    assertEquals(allocations[0].allocation, totalCap, 'Single depositor should get 100%');

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

  // Test 7: Unfilled amount calculation
  try {
    console.log = originalConsoleLog;
    console.log('Test 7: Test unfilled amount calculation...');
    console.log = () => {};

    const totalCap = 1000000;
    const deposits = [
      { wallet: '0xA', amount: 5000 },
      { wallet: '0xB', amount: 3000 }
    ];
    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);

    const allocations = deposits.map(d => ({
      wallet: d.wallet,
      allocation: (d.amount / totalDeposits) * totalCap
    }));

    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocation, 0);
    const unfilled = totalCap - totalAllocated;

    assertEquals(unfilled, 0, 'With proportional policy, unfilled should be 0');

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 7 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 7', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 7 failed:', error.message, '\n');
    console.log = () => {};
  }

  // Test 8: Fixed rate allocation with unfilled
  try {
    console.log = originalConsoleLog;
    console.log('Test 8: Test fixed rate allocation with unfilled amount...');
    console.log = () => {};

    const totalCap = 1000000;
    const rewardRate = 1.5;
    const deposits = [
      { wallet: '0xA', amount: 5000 },
      { wallet: '0xB', amount: 3000 }
    ];

    const allocations = deposits.map(d => ({
      wallet: d.wallet,
      allocation: d.amount * rewardRate
    }));

    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocation, 0);
    const unfilled = totalCap - totalAllocated;

    assertEquals(allocations[0].allocation, 7500, 'Wallet A allocation should be 5000 * 1.5');
    assertEquals(allocations[1].allocation, 4500, 'Wallet B allocation should be 3000 * 1.5');
    assertEquals(unfilled, 988000, 'Unfilled should be cap minus allocated');
    assertTrue(unfilled > 0, 'Should have unfilled amount');

    passed++;
    console.log = originalConsoleLog;
    console.log('✅ Test 8 passed\n');
    console.log = () => {};
  } catch (error) {
    failed++;
    errors.push({ test: 'Test 8', error: error.message });
    console.log = originalConsoleLog;
    console.log('❌ Test 8 failed:', error.message, '\n');
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
