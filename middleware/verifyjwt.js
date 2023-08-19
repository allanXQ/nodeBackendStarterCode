const jwt = require("jsonwebtoken");
const Messages = require("../utils/messages");
require("dotenv").config();

const verifyjwt = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({ message: Messages.invalidToken });
    }
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: Messages.invalidToken });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: Messages.serverError });
  }
};

module.exports = { verifyjwt };
