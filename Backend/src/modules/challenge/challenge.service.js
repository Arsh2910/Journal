const challengeModel = require("../modules/challenges/challenge.model");

function normalizeDate(date) {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;
}

function calculateCurrentDay(startDate) {
  const start = normalizeDate(startDate);
  const today = normalizeDate(new Date());

  const difference = today - start;

  const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));

  return daysPassed + 1;
}

async function getActiveChallenge(userId) {
  const challenge = await challengeModel.findOne({
    user: userId,
    status: "active",
  });

  return challenge;
}

function validateToday(challenge, requestedDate) {
  const today = normalizeDate(new Date());
  const date = normalizeDate(requestedDate);

  if (date.getTime() !== today.getTime()) {
    return false;
  }

  const currentDay = calculateCurrentDay(challenge.startDate);

  if (currentDay < 1 || currentDay > challenge.duration) {
    return false;
  }

  return true;
}

module.exports = {
  normalizeDate,
  calculateCurrentDay,
  getActiveChallenge,
  validateToday,
};
