const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const challengeRoutes = require("./routes/challenge.routes");
const noteRoutes = require("./routes/notes.routes");
const progressRoutes = require("./routes/progress.routes");
const userRoutes = require("./routes/user.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");
const express;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://daybook-one-swart.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/user", userRoutes);
app.use(errorMiddleware);
module.exports = app;
