const userModel = require("../user/user.model");
const journalModel = require("../journal/journal.model");
const noteModel = require("../note/note.model");
const challengeModel = require("../challenge/challenge.model");
const AppError = require("../../utils/appError");

/**
 * GET /api/admin/stats
 * Returns aggregate counts across all platform data.
 */
async function getStats(req, res, next) {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [totalUsers, totalJournals, totalNotes, totalChallenges, signupsLast7Days] =
      await Promise.all([
        userModel.countDocuments(),
        journalModel.countDocuments(),
        noteModel.countDocuments(),
        challengeModel.countDocuments(),
        userModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
      ]);

    // Gather DB System Health Stats
    const mongoose = require("mongoose");
    const dbStats = mongoose.connection.readyState === 1 ? await mongoose.connection.db.stats() : null;
    const systemHealth = dbStats ? {
      dbSizeMB: (dbStats.dataSize / 1024 / 1024).toFixed(2),
      storageSizeMB: (dbStats.storageSize / 1024 / 1024).toFixed(2),
      collections: dbStats.collections,
      indexes: dbStats.indexes,
      connections: mongoose.connection.base.connections.length,
    } : null;

    res.status(200).json({
      totalUsers,
      totalJournals,
      totalNotes,
      totalChallenges,
      signupsLast7Days,
      systemHealth,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/users?page=1&limit=20
 * Returns a paginated list of all users.
 */
async function getUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      userModel
        .find({}, "userName email avatar role createdAt lastLogin")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      userModel.countDocuments(),
    ]);

    res.status(200).json({
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/users/:id
 * Deletes a user and all their associated data (cascading delete).
 */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      throw new AppError("You cannot delete your own account from admin panel", 400);
    }

    const user = await userModel.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Cascading delete — remove all user data
    await Promise.all([
      journalModel.deleteMany({ user: id }),
      noteModel.deleteMany({ user: id }),
      challengeModel.deleteMany({ user: id }),
    ]);

    await userModel.findByIdAndDelete(id);

    res.status(200).json({
      message: `User "${user.userName}" and all associated data deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats, getUsers, deleteUser };
