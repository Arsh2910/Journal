const express = require("express");
const router = express.Router();
const { createJournal } = require("../controllers/journal.controller");
const {
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} = require("../controllers/journal.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/create", authUser, createJournal);
router.get("/all", authUser, getJournals);
router.get("/:id", authUser, getJournalById);
router.put("/:id", authUser, updateJournal);
router.delete("/:id", authUser, deleteJournal);
module.exports = router;
