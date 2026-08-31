// auth.service.js
const User = require("../user/user.model");

async function generateUniqueUsername(email) {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  let candidate = base;
  let suffix = 0;
  while (await User.findOne({ userName: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
}

async function findOrCreateGoogleUser({ email, googleId, avatar }) {
  let user = await User.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    return { user, isNew: false };
  }

  const userName = await generateUniqueUsername(email);
  user = await User.create({
    email,
    googleId,
    userName,
    avatar: avatar || "avatar-default",
  });
  return { user, isNew: true };
}

module.exports = { findOrCreateGoogleUser };
