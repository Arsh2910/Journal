const express = require("express");
const router = express.Router();
const { updateAvatar } = require("../controllers/user.controller");
const { authUser } = require("../middlewares/auth.middleware");

// PATCH /api/user/avatar — requires auth
router.patch("/avatar", authUser, updateAvatar);

module.exports = router;
