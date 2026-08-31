const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);
challengeSchema.index({
  user: 1,
  status: 1,
});
const challengeModel = mongoose.model("Challenge", challengeSchema);

module.exports = challengeModel;
