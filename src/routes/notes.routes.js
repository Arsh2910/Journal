const express = require("express");

const router = express.Router();

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notes.controller");

const { authUser } = require("../middlewares/auth.middleware");

router.post("/create", authUser, createNote);
router.get("/:date", authUser, getNotes);
router.patch("/:id", authUser, updateNote);
router.delete("/:id", authUser, deleteNote);

module.exports = router;
