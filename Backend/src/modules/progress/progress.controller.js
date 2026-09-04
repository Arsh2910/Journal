const AppError = require("../../utils/appError");

const {
  getActiveChallenge,
  calculateCurrentDay,
} = require("../challenge/challenge.service");

const {
  getCompletedDays,
  getCompletedDayNumbers,
} = require("./progress.service");

async function getChallengeProgress(req, res, next) {
  try {
    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const currentDay = calculateCurrentDay(challenge.startDate);

    const completedDays = await getCompletedDays(challenge._id);

    const completedDayNumbers = await getCompletedDayNumbers(challenge._id);

    const missedDays = Math.max(
      0,
      Math.min(currentDay - 1, challenge.duration) - completedDays,
    );

    const progress = Math.round((completedDays / challenge.duration) * 100);

    res.status(200).json({
      success: true,

      challenge: {
        id: challenge._id,
        startDate: challenge.startDate,
        duration: challenge.duration,
        status: challenge.status,
      },

      currentDay,

      completedDays,

      missedDays,

      remainingDays: challenge.duration - completedDays,

      progress,

      completedDayNumbers,
    });
  } catch (error) {
    next(error);
  }
}

async function getChallengeDayMap(req, res, next) {
  try {
    const challenge = await getActiveChallenge(req.user.id);

    if (!challenge) {
      throw new AppError("No active challenge found", 404);
    }

    const completedDayNumbers = await getCompletedDayNumbers(challenge._id);

    const completedSet = new Set(completedDayNumbers);

    const days = [];

    for (let day = 1; day <= challenge.duration; day++) {
      days.push({
        day,
        completed: completedSet.has(day),
      });
    }

    res.status(200).json({
      success: true,
      days,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getChallengeProgress,
  getChallengeDayMap,
};
