const journalModel = require("../models/journal.model");

async function createJournal(req, res, next) {
  const { title, content, date, mood, dayNumber } = req.body;
  console.log("User ID:", req.user.id);
  try {
    console.log("User ID inside try:", req.user.id);
    const journal = await journalModel.create({
      user: req.user.id,
      title,
      content,
      date,
      mood,
      dayNumber,
    });
    console.log("reached");

    res.status(201).json({
      message: "Journal created successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createJournal };
