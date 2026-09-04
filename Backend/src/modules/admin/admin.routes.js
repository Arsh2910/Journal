const express = require("express");
const router = express.Router();
const { authUser } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/admin.middleware");
const { getStats, getUsers, deleteUser } = require("./admin.controller");

// All admin routes require authentication + admin role
router.use(authUser, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
