const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { recipient, badgeId } = req.body;
  res.json({ success: true, txHash: '0xMockMintHash' });
});

module.exports = router;
