const { z } = require("zod");

const createChallengeSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),

  duration: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day"),
});

module.exports = {
  createChallengeSchema,
};
