const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const authRoutes = require("./modules/auth/auth.routes");
const journalRoutes = require("./modules/journal/journal.routes");
const challengeRoutes = require("./modules/challenge/challenge.routes");
const noteRoutes = require("./modules/note/note.routes");
const progressRoutes = require("./routes/progress.routes");
const userRoutes = require("./modules/user/user.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");
app.set("trust proxy", 1);
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
