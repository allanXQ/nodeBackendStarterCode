const uuid = require("uuid");
const User = require("../../models/Users");
const bcrypt = require("bcrypt");
const Messages = require("../../utils/messages");

const Register = async (req, res) => {
  const {
    username,
    email,
    referrer,
    phone,
    password: plainPassword,
  } = req.body;
  const id = uuid.v4();

  try {
    const getUser = await User.findOne({ username });
    const getPhone = await User.findOne({ phone });
    const getEmail = await User.findOne({ email });
    if (getUser) {
      return res.status(400).json({ message: Messages.invalidUsername });
    }
    if (getEmail) {
      return res.status(400).json({ message: Messages.invalidEmail });
    }
    if (getPhone) {
      return res.status(400).json({ message: Messages.invalidPhoneNumber });
    }
    const password = await bcrypt.hash(plainPassword, 10);
    await User.create({
      userid: id,
      username,
      email,
      phone,
      referrer,
      password,
    });
    return res.status(200).json({ message: Messages.userCreatedSuccessfully });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { Register };
