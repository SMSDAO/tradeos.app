const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { fromToken, toToken, amount } = req.body;
  res.json({
    success: true,
    data: { executed: true, path: [fromToken, toToken], amount }
  });
});

module.exports = router;
