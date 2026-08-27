const noteModel = require("../models/notes.model");
const AppError = require("../utils/appError");

async function createNote(req, res, next) {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      throw new AppError("Title and date are required", 400);
    }

    const note = await noteModel.create({
      user: req.user.id,
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

    const notes = await noteModel.find({
      user: req.user.id,
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

    const note = await noteModel.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        completed,
      },
      {
        returnDocument: "after",
      },
    );

    if (!note) {
      throw new AppError("Note not found", 404);
    }

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

    const note = await noteModel.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!note) {
      throw new AppError("Note not found", 404);
    }

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
