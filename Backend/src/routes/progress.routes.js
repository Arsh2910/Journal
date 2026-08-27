const express = require("express");

const router = express.Router();

const {
  getChallengeProgress,
  getChallengeDayMap,
} = require("../controllers/progress.controller");

const { authUser } = require("../middlewares/auth.middleware");

router.get("/", authUser, getChallengeProgress);

router.get("/days", authUser, getChallengeDayMap);

module.exports = router;
