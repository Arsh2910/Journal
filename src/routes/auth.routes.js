const express = require("express");
const router = express.Router();
const authController = require("../controllers/register.controller");
const authUser = require("../middlewares/auth.middleware");
router.post("/register", authController.registerUser);
router.post("/login", authUser, authController.loginUser);

module.exports = router;
