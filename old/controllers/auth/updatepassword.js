require("dotenv").config();
const User = require("../../models/Users");
const bcrypt = require("bcrypt");
const Messages = require("../../utils/messages");

const UpdatePassword = async (req, res) => {
  try {
    const { userid, oldPassword, newPassword: plainPassword } = req.body;
    const getUser = await User.findOne({ userid });
    if (!getUser) {
      return res.status(400).json({ message: Messages.userNotFound });
    }
    const bcompare = await bcrypt.compare(oldPassword, getUser.password);
    if (!bcompare) {
      return res.status(400).json({ message: Messages.incorrectPassword });
    }
    hashedPassword = await bcrypt.hash(plainPassword, 10);
    const userUpdate = await User.updateOne(
      { userid },
      {
        $set: { password: hashedPassword },
      }
    );
    if (userUpdate.nModified === 0) {
      return res.status(400).json({ message: Messages.updateFailed });
    }
    res.status(200).json({ message: Messages.updateSuccess });
  } catch (error) {
    //console.log(error)
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { UpdatePassword };
