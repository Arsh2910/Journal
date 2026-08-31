const journalModel = require("../journals/journal.model");

async function getCompletedDays(challengeId) {
  return await journalModel.countDocuments({
    challenge: challengeId,
  });
}

async function getCompletedDayNumbers(challengeId) {
  const journals = await journalModel
    .find({
      challenge: challengeId,
    })
    .select("dayNumber -_id")
    .sort({ dayNumber: 1 });

  return journals.map((journal) => journal.dayNumber);
}

module.exports = {
  getCompletedDays,
  getCompletedDayNumbers,
};
