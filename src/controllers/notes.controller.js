const noteModel = require("../models/notes.model");
const AppError = require("../utils/appError");

const {
  getActiveChallenge,
  validateToday,
} = require("../services/challenge.service");

async function createNote(req, res, next) {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      throw new AppError("Title and date are required", 400);
    }

    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const allowed = validateToday(challenge, date);

    if (!allowed) {
      throw new AppError("You can only create notes for today", 403);
    }

    const note = await noteModel.create({
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

async function getNotes(req, res, next) {
  try {
    const { date } = req.params;

    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const allowed = validateToday(challenge, date);

    if (!allowed) {
      throw new AppError("You can only access today's notes", 403);
    }

    const notes = await noteModel.find({
      user: req.user.id,
      challenge: challenge._id,
      date,
    });

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
    const { completed } = req.body;

    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const note = await noteModel.findOne({
      _id: id,
      user: req.user.id,
      challenge: challenge._id,
    });

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    if (!validateToday(challenge, note.date)) {
      throw new AppError("You can only modify today's notes", 403);
    }

    note.completed = completed;

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

    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const note = await noteModel.findOne({
      _id: id,
      user: req.user.id,
      challenge: challenge._id,
    });

    if (!note) {
      throw new AppError("Note not found", 404);
    }

    if (!validateToday(challenge, note.date)) {
      throw new AppError("You can only delete today's notes", 403);
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
  getNotes,
  updateNote,
  deleteNote,
};
