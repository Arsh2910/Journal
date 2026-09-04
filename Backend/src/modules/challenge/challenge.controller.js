const challengeModel = require("./challenge.model");
const AppError = require("../../utils/appError");

const { calculateCurrentDay } = require("./challenge.service");

async function createChallenge(req, res, next) {
  try {
    const { startDate, duration } = req.body;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    if (start.getTime() !== today.getTime()) {
      throw new AppError("Challenge must start today", 400);
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

    const currentDay = calculateCurrentDay(challenge.startDate);

    if (currentDay > challenge.duration) {
      challenge.status = "completed";

      await challenge.save();

      return res.status(200).json({
        success: true,
        message: "Challenge completed",
        challenge,
      });
    }

    res.status(200).json({
      success: true,
      challenge,
      currentDay,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createChallenge,
  getCurrentChallenge,
};
