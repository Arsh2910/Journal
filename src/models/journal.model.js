const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    mood: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

journalSchema.index(
  {
    challenge: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Journal",
  journalSchema
);