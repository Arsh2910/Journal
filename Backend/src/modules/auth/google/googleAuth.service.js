const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const googleId = payload["sub"];
  const email = payload["email"];
  const picture = payload["picture"];

  return {
    email,
    googleId,
    avatar: picture,
  };
}

module.exports = { verifyGoogleToken };
