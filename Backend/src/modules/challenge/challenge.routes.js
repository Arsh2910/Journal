const express = require("express");

const router = express.Router();

const {
  createChallenge,
  getCurrentChallenge,
} = require("./challenge.controller");
const { createChallengeSchema } = require("./challenge.schema");
const { authUser } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
router.post(
  "/create",
  validate(createChallengeSchema),
  authUser,
  createChallenge,
);
router.get("/current", authUser, getCurrentChallenge);

module.exports = router;
