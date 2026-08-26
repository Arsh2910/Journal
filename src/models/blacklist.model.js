const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const tokenBlacklistModel = new mongoose.model(
  "TokenBlacklist",
  blacklistSchema,
);
module.exports = tokenBlacklistModel;
