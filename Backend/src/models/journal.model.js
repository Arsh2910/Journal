const mongoose = require("mongoose");
const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    mood: {
      type: String,
      required: true,
      trim: true,
    },

    dayNumber: {
      type: Number,
      required: true,
    },

    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

journalSchema.index({ user: 1, challenge: 1, dayNumber: 1 }, { unique: true });

const journalModel = mongoose.model("Journal", journalSchema);
module.exports = journalModel;
