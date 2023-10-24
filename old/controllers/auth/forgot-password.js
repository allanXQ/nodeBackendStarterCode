require("dotenv").config();
const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const Messages = require("../../utils/messages");

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ message: Messages.userNotFound });
    }
    const secret = process.env.JWT_SECRET;
    const payload = {
      id: findUser.userid,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const url = process.env.APP_URL;
    const id = findUser.userid;

    findUser.passwordResetToken = token;

    await findUser.save();

    const link = `${url}/api/v1/auth/reset-password/${id}/${token}`;

    nodeoutlook.sendEmail({
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<h3><b>Password Reset</b> </h3>
              <div>
                <p>We have received a request to reset your password.</p>
                <p>${link}</p>
                <p>This link expires in 15 minutes</p>
                <p>If this wasn't you contact the admin to suspend any current transactions until further notice.</p>
                </div>`,
      //text: 'This is text version!',
      onError: (e) => {
        console.log(e);
        return res.status(400).json({ message: Messages.requestFailed });
      },
      onSuccess: (i) => {
        return res.status(200).json({
          message: Messages.passwordResetEmail,
        });
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { ForgotPassword };
