const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../../models/Users");
const Messages = require("../../utils/messages");
const { generateTokens, setCookies } = require("../../utils/cookie");

const RefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: Messages.invalidRefreshToken });
    }

    const FindJwt = User.findOne({ refreshToken });

    if (!FindJwt) {
      return res.status(401).json({ message: Messages.invalidRefreshToken });
    }

    const verify = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (!verify) {
      return res.status(401).json({ message: Messages.invalidRefreshToken });
    }
    const tokens = generateTokens(verify);
    setCookies(res, tokens);

    const tokenUpdate = await User.updateOne(
      { refreshToken },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    if (tokenUpdate.nModified === 0) {
      return res.status(401).json({ message: Messages.requestFailed });
    }
    return res.status(200).json({ message: Messages.tokenRefreshed });
  } catch (error) {
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { RefreshToken };
