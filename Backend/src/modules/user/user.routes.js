const express = require("express");
const router = express.Router();
const { updateAvatar, getCurrentUser } = require("./user.controller");
const { authUser } = require("../../middlewares/auth.middleware");

router.patch("/avatar", authUser, updateAvatar);

router.get("/me", authUser, getCurrentUser);

module.exports = router;
