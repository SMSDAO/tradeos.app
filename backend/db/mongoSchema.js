const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: Number,
  owner: String,
  mintedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
