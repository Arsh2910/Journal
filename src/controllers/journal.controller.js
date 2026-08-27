const journalModel = require("../models/journal.model");
const AppError = require("../utils/appError");

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
async function getJournals(req, res, next) {
  const userId = req.user.id;
  try {
    const journals = await journalModel.find({ user: userId });
    res.status(200).json({
      message: "Journals retrieved successfully",
      journals,
    });
  } catch (error) {
    next(error);
  }
}
async function getJournalById(req, res, next) {
  const userId = req.user.id;
  const journalId = req.params.id;
  try {
    const journal = await journalModel.findOne({
      _id: journalId,
      user: userId,
    });
    if (!journal) {
      throw new AppError("Journal does not exists", 404);
    }

    res.status(200).json({
      message: "Journal retrieved successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}
async function updateJournal(req, res, next) {
  const userId = req.user.id;
  const journalId = req.params.id;
  const { title, content, date, mood, dayNumber } = req.body;
  try {
    const journal = await journalModel.findOneAndUpdate(
      { _id: journalId, user: userId },
      { title, content, date, mood, dayNumber },
      { returnDocument: "after" },
    );
    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }
    res.status(200).json({
      message: "Journal updated successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteJournal(req, res, next) {
  const userId = req.user.id;
  const journalId = req.params.id;
  try {
    const journal = await journalModel.findOneAndDelete({
      _id: journalId,
      user: userId,
    });
    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }
    res.status(200).json({
      message: "Journal deleted successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
};
