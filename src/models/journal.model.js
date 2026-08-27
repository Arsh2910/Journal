const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
});

const journalModel = mongoose.model("journal", journalSchema);
module.exports = journalModel;
