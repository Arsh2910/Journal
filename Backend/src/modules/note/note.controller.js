const mongoose = require("mongoose");

const notesModel = require("./note.model");
const AppError = require("../../utils/appError");

const {
  getActiveChallenge,
  calculateCurrentDay,
  normalizeDate,
} = require("../challenge/challenge.service");

async function createNote(req, res, next) {
  try {
    const { title, date } = req.body;

    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const requestedDate = normalizeDate(date);

    const today = normalizeDate(new Date());

    if (requestedDate.getTime() !== today.getTime()) {
      throw new AppError("You can only create today's notes", 403);
    }

    const currentDay = calculateCurrentDay(challenge.startDate);

    if (currentDay > challenge.duration) {
      throw new AppError("Challenge is completed", 403);
    }

    const note = await notesModel.create({
      user: req.user.id,
      challenge: challenge._id,
      title,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
}

async function getTodayNotes(req, res, next) {
  try {
    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const today = normalizeDate(new Date());

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const notes = await notesModel
      .find({
        user: req.user.id,
        challenge: challenge._id,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const note = await notesModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!note) {
      throw new AppError("Note does not exist", 404);
    }

    const today = normalizeDate(new Date());

    const noteDate = normalizeDate(note.date);

    if (noteDate.getTime() !== today.getTime()) {
      throw new AppError("Only today's notes can be edited", 403);
    }

    if (title !== undefined) {
      note.title = title;
    }

    if (completed !== undefined) {
      note.completed = completed;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;

    const note = await notesModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!note) {
      throw new AppError("Note does not exist", 404);
    }

    const today = normalizeDate(new Date());

    const noteDate = normalizeDate(note.date);

    if (noteDate.getTime() !== today.getTime()) {
      throw new AppError("Only today's notes can be deleted", 403);
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNote,
  getTodayNotes,
  updateNote,
  deleteNote,
};
