const router = require("express").Router();

const { UpdatePassword } = require("../../controllers/auth/updatepassword");
const { Login } = require("../../controllers/auth/login");
const { Register } = require("../../controllers/auth/register");
const { ResetPassword } = require("../../controllers/auth/reset-password");
const { verifyjwt } = require("../../middleware/verifyjwt");
const { ForgotPassword } = require("../../controllers/auth/forgot-password");
const { RefreshToken } = require("../../controllers/auth/refreshjwt");
const { Logout } = require("../../controllers/auth/logout");
const formValidate = require("../../middleware/validate");
const {
  regSchema,
  loginSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../../yupschemas");

router.post("/register", formValidate(regSchema), Register);
router.post("/login", formValidate(loginSchema), Login);
router.post(
  "/reset-password/:id/:token",
  formValidate(resetPasswordSchema),
  ResetPassword
);
router.post("/refresh-token", RefreshToken);
router.post("/logout", Logout);

router.post(
  "/forgot-password",
  formValidate(forgotPasswordSchema),
  ForgotPassword
);
router.post(
  "/update-password",
  verifyjwt,
  formValidate(updatePasswordSchema),
  UpdatePassword
);

module.exports = router;
