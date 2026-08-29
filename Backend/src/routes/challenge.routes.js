const express = require("express");

const router = express.Router();

const {
  createChallenge,
  getCurrentChallenge,
} = require("../controllers/challenge.controller");
const { createChallengeSchema } = require("../schemas/challenge.schema");
const { authUser } = require("../middlewares/auth.middleware");

router.post(
  "/create",
  validate(createChallengeSchema),
  authUser,
  createChallenge,
);
router.get("/current", authUser, getCurrentChallenge);

module.exports = router;
