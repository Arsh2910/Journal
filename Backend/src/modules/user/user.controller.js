const userModel = require("./user.model");
const AppError = require("../../utils/appError");

const ALLOWED_AVATARS = [
  "avatar-default",
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4",
  "avatar-5",
  "avatar-6",
  "avatar-7",
  "avatar-8",
  "avatar-9",
  "avatar-10",
  "avatar-11",
  "avatar-12",
];

async function updateAvatar(req, res, next) {
  try {
    const { avatarId } = req.body;

    if (!avatarId) {
      throw new AppError("avatarId is required", 400);
    }

    if (!ALLOWED_AVATARS.includes(avatarId)) {
      throw new AppError(
        `Invalid avatar ID. Must be one of: ${ALLOWED_AVATARS.join(", ")}`,
        400,
      );
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarId },
      { new: true },
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { updateAvatar, getCurrentUser };
