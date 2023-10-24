const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateTokens = (user) => {
  const payload = { id: user.userid, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1h",
  });
  return { accessToken, refreshToken };
};

const setCookies = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    // secure: true,
    maxAge: 1 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

module.exports = { generateTokens, setCookies };
