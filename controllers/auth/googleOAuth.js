const getGoogleAuthTokens = require("../../utils/getGoogleAuthTokens");
require("dotenv").config();
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../../models/users");
const { generateTokens, setCookies } = require("../../utils/cookie");
const Messages = require("../../utils/messages");

const id = uuid.v4();

const UserSuccess = async (res, findUser, email) => {
  const tokens = generateTokens(findUser);
  const userUpdate = await User.updateOne(
    { email },
    { $set: { refreshToken: tokens.refreshToken } }
  );
  if (userUpdate.nModified === 0) {
    return res.status(400).json({ message: Messages.loginFailed });
  }
  setCookies(res, tokens);
  return res.redirect(301, `${process.env.CLIENT_URL}/dashboard`);
};

const googleOAuth = async (req, res) => {
  try {
    const code = req.query.code;
    const { id_token, access_token } = await getGoogleAuthTokens(code);
    const decoded = jwt.decode(id_token);
    const { email, name } = decoded;
    const findUser = await User.findOne({ email });
    if (findUser) return await UserSuccess(res, findUser, email);
    const createUser = await User.create({
      userid: id,
      email,
      googleName: name,
      authMethod: "google",
    });
    if (!createUser) {
      return res.status(400).json({ message: Messages.loginFailed });
    }
    return await UserSuccess(res, createUser, email);
  } catch (error) {
    console.log(error);
    return res.redirect(301, `${process.env.CLIENT_URL}/login`);
  }
};

module.exports = { googleOAuth };
