const express = require("express");

const router = express.Router();

const {
  createNote,
  getTodayNotes,
  updateNote,
  deleteNote,
} = require("./note.controller");
const { createNoteSchema, updateNoteSchema } = require("./note.schema");
const { authUser } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { objectIdSchema } = require("../../shared/schema/common.schema");
router.post("/create", validate(createNoteSchema), authUser, createNote);
router.get("/today", authUser, getTodayNotes);
router.patch(
  "/:id",
  validate(objectIdSchema, "params"),
  validate(updateNoteSchema, "body"),
  authUser,
  updateNote,
);
router.delete("/:id", validate(objectIdSchema, "params"), authUser, deleteNote);

module.exports = router;
