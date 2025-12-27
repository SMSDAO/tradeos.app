const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    success: true,
    data: { swapFee: 0.0025, mintFee: 0.001 }
  });
});

module.exports = router;
