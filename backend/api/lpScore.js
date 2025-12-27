const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    success: true,
    score: 87.6
  });
});

module.exports = router;
