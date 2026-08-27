const express = require("express");

const router = express.Router();

const {
  createChallenge,
  getCurrentChallenge,
} = require("../controllers/challenge.controller");

const { authUser } = require("../middlewares/auth.middleware");

router.post("/create", authUser, createChallenge);
router.get("/current", authUser, getCurrentChallenge);

module.exports = router;
