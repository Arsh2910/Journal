const { z } = require("zod");

const journalSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  content: z.string().trim().min(1, "Content is required"),
  mood: z.string().trim().min(1, "Mood is required"),
});

const updateJournalSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),

    content: z.string().trim().min(1, "Content is required").optional(),

    mood: z.string().trim().min(1, "Mood is required").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

const journalQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(50).default(10),

  search: z.string().trim().optional(),
});
module.exports = {
  journalSchema,
  updateJournalSchema,
  journalQuerySchema,
};
