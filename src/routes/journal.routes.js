const express = require("express");
const router = express.Router();
const { createJournal } = require("../controllers/journal.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/create", authUser, createJournal);
module.exports = router;
