#!/usr/bin/env node

/**
 * Test runner for TGE features
 * 
 * Usage: node backend/tests/runTests.js
 */

const liquidityTests = require('./liquidityDistributor.test');
const poolTests = require('./launchPool.test');

async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   TradeOS TGE Test Suite                  ║');
  console.log('╚════════════════════════════════════════════╝');

  let totalPassed = 0;
  let totalFailed = 0;

  try {
    // Run liquidity distributor tests
    const liquidityResults = await liquidityTests.runTests();
    totalPassed += liquidityResults.passed;
    totalFailed += liquidityResults.failed;

    // Run launch pool tests
    const poolResults = await poolTests.runTests();
    totalPassed += poolResults.passed;
    totalFailed += poolResults.failed;

    // Final summary
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   Final Summary                            ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`\n  Total Tests: ${totalPassed + totalFailed}`);
    console.log(`  ✅ Passed: ${totalPassed}`);
    console.log(`  ❌ Failed: ${totalFailed}`);
    console.log('');

    if (totalFailed > 0) {
      console.log('❌ Some tests failed. Please review the output above.\n');
      process.exit(1);
    } else {
      console.log('✅ All tests passed!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Test suite encountered an error:', error.message);
    process.exit(1);
  }
}

runAllTests();
