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

    const currentDay = calculateCurrentDay(challenge.startDate);

    if (currentDay > challenge.duration) {
      challenge.status = "completed";
      await challenge.save();

      throw new AppError("Challenge has been completed", 403);
    }

    const allowed = validateToday(challenge, date);

    if (!allowed) {
      throw new AppError("You can only create today's journal page", 403);
    }

    const existingJournal = await journalModel.findOne({
      user: req.user.id,
      challenge: challenge._id,
      date,
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
      dayNumber: currentDay,
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
    const userId = req.user.id;

    const journals = await journalModel.find({
      user: userId,
    });

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
    const userId = req.user.id;
    const journalId = req.params.id;

    const journal = await journalModel.findOne({
      _id: journalId,
      user: userId,
    });

    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }

    res.status(200).json({
      success: true,
      message: "Journal retrieved successfully",
      journal,
    });
  } catch (error) {
    next(error);
  }
}

async function updateJournal(req, res, next) {
  try {
    const userId = req.user.id;
    const journalId = req.params.id;

    const { title, content, mood } = req.body;

    const challenge = await getActiveChallenge(userId);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const journal = await journalModel.findOne({
      _id: journalId,
      user: userId,
      challenge: challenge._id,
    });

    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }

    const allowed = validateToday(challenge, journal.date);

    if (!allowed) {
      throw new AppError("You can only modify today's journal", 403);
    }

    journal.title = title;
    journal.content = content;
    journal.mood = mood;

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
    const userId = req.user.id;
    const journalId = req.params.id;

    const challenge = await getActiveChallenge(userId);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const journal = await journalModel.findOne({
      _id: journalId,
      user: userId,
      challenge: challenge._id,
    });

    if (!journal) {
      throw new AppError("Journal does not exist", 404);
    }

    const allowed = validateToday(challenge, journal.date);

    if (!allowed) {
      throw new AppError("You can only delete today's journal", 403);
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
