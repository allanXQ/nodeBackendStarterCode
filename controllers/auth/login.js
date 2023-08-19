require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const Messages = require("../../utils/messages");
const { setCookies, generateTokens } = require("../../utils/cookie");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: Messages.invalidCredentials });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(400).json({ message: Messages.invalidCredentials });
    }
    const tokens = generateTokens(user);
    const userUpdate = await User.updateOne(
      { email },
      { $set: { refreshToken: tokens.refreshToken } }
    );
    if (userUpdate.nModified === 0) {
      return res.status(400).json({ message: Messages.loginFailed });
    }
    setCookies(res, tokens);
    return res.status(200).json({
      message: Messages.loginSuccess,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: Messages.serverError });
  }
};

module.exports = { Login };
