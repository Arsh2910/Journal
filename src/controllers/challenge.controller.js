const challengeModel = require("../models/challenge.model");
const AppError = require("../utils/appError");

async function createChallenge(req, res, next) {
  try {
    const { startDate, duration } = req.body;

    if (!startDate || !duration) {
      throw new AppError("Start date and duration are required", 400);
    }

    if (duration < 1) {
      throw new AppError("Duration must be at least 1 day", 400);
    }

    const existingChallenge = await challengeModel.findOne({
      user: req.user.id,
      status: "active",
    });

    if (existingChallenge) {
      throw new AppError("You already have an active challenge", 409);
    }

    const challenge = await challengeModel.create({
      user: req.user.id,
      startDate,
      duration,
    });

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentChallenge(req, res, next) {
  try {
    const challenge = await challengeModel.findOne({
      user: req.user.id,
      status: "active",
    });

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createChallenge,
  getCurrentChallenge,
};
