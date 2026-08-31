const { z } = require("zod");

const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"),
});

module.exports = {
  objectIdSchema,
};
