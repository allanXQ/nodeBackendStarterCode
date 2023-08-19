require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const Messages = require("../../utils/messages");

const ResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { id, token } = req.params;
    if (!token || !id || !password) {
      return res.status(400).json({ message: Messages.invalidRequest });
    }
    const getUser = await User.findOne({ userid: id });
    if (!getUser) {
      return res.status(400).json({ message: Messages.userNotFound });
    }
    const passwordResetToken = getUser.passwordResetToken;
    if (passwordResetToken.length === 0) {
      return res.status(400).json({ message: Messages.invalidRequest });
    }

    const secret = process.env.JWT_SECRET;
    const verify = jwt.verify(token, secret);
    if (!verify) {
      return res.status(403).json({ message: Messages.invalidToken });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const userUpdate = await User.findOneAndUpdate(
      { userid: id },
      {
        $set: { password: hashedpassword, passwordResetToken: "" },
      },
      { new: true }
    );
    if (!userUpdate) {
      return res.status(400).json({ message: Messages.requestFailed });
    }
    res.status(200).json({ message: Messages.requestSuccessful });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { ResetPassword };
