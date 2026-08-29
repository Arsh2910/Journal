const express = require("express");
const router = express.Router();
const { createJournal } = require("../controllers/journal.controller");
const {
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} = require("../controllers/journal.controller");
const {
  journalSchema,
  updateJournalSchema,
  journalQuerySchema,
} = require("../schemas/journal.schema");
const validate = require("../middlewares/validate.middleware");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/create", validate(journalSchema), authUser, createJournal);
router.get("/all", validate(journalQuerySchema, "query"), getJournals);
router.get("/:id", authUser, getJournalById);
router.put("/:id", validate(updateJournalSchema), authUser, updateJournal);
router.delete("/:id", authUser, deleteJournal);
module.exports = router;
