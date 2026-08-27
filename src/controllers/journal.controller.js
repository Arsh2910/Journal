const journalModel = require("../models/journal.model");
const AppError = require("../utils/appError");

const {
  getActiveChallenge,
  calculateCurrentDay,
  validateToday,
} = require("../services/challenge.service");

async function createJournal(req, res, next) {
  try {
    const { title, content, date, mood } = req.body;

    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const allowed = validateToday(challenge, date);

    if (!allowed) {
      throw new AppError("You can only create today's journal page", 403);
    }

    const dayNumber = calculateCurrentDay(challenge.startDate);

    if (dayNumber > challenge.duration) {
      throw new AppError("Challenge is completed", 403);
    }

    const existingJournal = await journalModel.findOne({
      user: req.user.id,
      challenge: challenge._id,
      dayNumber,
    });

    if (existingJournal) {
      throw new AppError("Today's journal already exists", 409);
    }

    const journal = await journalModel.create({
      user: req.user.id,
      challenge: challenge._id,
      title,
      content,
      date,
      mood,
      dayNumber,
    });

    res.status(201).json({
      success: true,
      message: "Journal created successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}

async function getJournals(req, res, next) {
  try {
    const journals = await journalModel
      .find({
        user: req.user.id,
      })
      .sort({ dayNumber: 1 });

    res.status(200).json({
      success: true,
      message: "Journals retrieved successfully",
      journals,
    });
  } catch (error) {
    next(error);
  }
}

async function getJournalById(req, res, next) {
  try {
    const journal = await journalModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }

    res.status(200).json({
      success: true,
      journal,
    });
  } catch (error) {
    next(error);
  }
}

async function updateJournal(req, res, next) {
  try {
    const { title, content, mood } = req.body;

    const journal = await journalModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const journalDate = new Date(journal.date);

    journalDate.setHours(0, 0, 0, 0);

    if (journalDate.getTime() !== today.getTime()) {
      throw new AppError("Only today's journal can be edited", 403);
    }

    journal.title = title ?? journal.title;
    journal.content = content ?? journal.content;
    journal.mood = mood ?? journal.mood;

    await journal.save();

    res.status(200).json({
      success: true,
      message: "Journal updated successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteJournal(req, res, next) {
  try {
    const journal = await journalModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const journalDate = new Date(journal.date);

    journalDate.setHours(0, 0, 0, 0);

    if (journalDate.getTime() !== today.getTime()) {
      throw new AppError("Only today's journal can be deleted", 403);
    }

    await journal.deleteOne();

    res.status(200).json({
      success: true,
      message: "Journal deleted successfully",
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
