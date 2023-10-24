const yup = require("yup");
const Messages = require("../utils/messages");
const { WalletConfig } = require("../config");

const passwordRegexp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
const phoneRegexp = /^(2547|2541)\d{8}$/;

const regSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^(2547|2541)\d{8}$/, Messages.invalidPhoneNumber)
    .required(),
  referrer: yup.string(),
  password: yup
    .string()
    .matches(passwordRegexp, Messages.passwordRegex)
    .required(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const userInfoSchema = yup.object().shape({
  userId: yup.string().required(),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
});

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(passwordRegexp, Messages.passwordRegex)
    .required(),
});

const updatePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .matches(passwordRegexp, `Old ${Messages.passwordRegex}`)
    .required(),
  newPassword: yup
    .string()
    .matches(passwordRegexp, `New ${Messages.passwordRegex}`)
    .required(),
});

const depositSchema = yup.object().shape({
  amount: yup
    .number()
    .lessThan(WalletConfig.maxDeposit)
    .moreThan(WalletConfig.minDeposit)
    .required(),
  phone: yup
    .string()
    .matches(phoneRegexp, Messages.invalidPhoneNumber)
    .required(),
});

const withdrawalSchema = yup.object().shape({
  amount: yup
    .number()
    .lessThan(WalletConfig.maxWithdrawal)
    .moreThan(WalletConfig.minWithdrawal)
    .required(),
  phone: yup
    .string()
    .matches(phoneRegexp, Messages.invalidPhoneNumber)
    .required(),
});

const p2pOrderSchema = yup.object().shape({
  userId: yup.string().required(),
  assetName: yup.string().required(),
  orderType: yup.string().required(),
  amount: yup.number().moreThan(0).required(),
  price: yup.number().required(),
});

const limitOrderSchema = yup.object().shape({
  userId: yup.string().required(),
  assetName: yup.string().required(),
  amount: yup.number().moreThan(0).required(),
});

const cancelOrderSchema = yup.object().shape({
  orderId: yup.string().required(),
  userId: yup.string().required(),
});

const addAssetSchema = yup.object().shape({
  assetName: yup.string().required(),
  amount: yup.number().moreThan(0).required(),
  coinPair: yup.string().required(),
});

const historicalKlinesSchema = yup.object().shape({
  assetName: yup.string().required(),
  klineInterval: yup.string().required(),
});

module.exports = {
  regSchema,
  loginSchema,
  userInfoSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  depositSchema,
  withdrawalSchema,
  p2pOrderSchema,
  cancelOrderSchema,
  limitOrderSchema,
  addAssetSchema,
  historicalKlinesSchema,
};
