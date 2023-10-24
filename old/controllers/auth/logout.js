const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const Messages = require("../../utils/messages");
require("dotenv").config();

const clearTokens = (res) => {
  res.cookie("accessToken", "", {
    expires: new Date(0),
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
  });
  res.cookie("refreshToken", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/api/v1/auth/refresh-token",
    // secure: true,
    sameSite: "strict",
  });
};

const Logout = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({ message: Messages.invalidToken });
    }
    const verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ message: Messages.invalidToken });
    }
    const user = await User.findOneAndUpdate(
      { userid: verify.id },
      {
        $set: { refreshToken: null },
      },
      { new: true }
    );
    if (!user) {
      clearTokens(res);
      return res.status(401).json({ message: Messages.invalidToken });
    }
    clearTokens(res);
    return res.status(200).json({ message: Messages.logOutSuccess });
  } catch (error) {
    console.log(error);
    clearTokens(res);
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { Logout };
