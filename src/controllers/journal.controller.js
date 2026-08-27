const journalModel = require("../models/journal.model");

async function createJournal(req, res, next) {
  const { title, content } = req.body;

  try {
    const journal = await journalModel.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json({
      message: "Journal created successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createJournal };
