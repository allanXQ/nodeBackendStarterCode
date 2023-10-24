const router = require("express").Router();

const {
  MpesaWithdraw,
} = require("../../controllers/account/Wallet/MpesaWithdraw");
const {
  TinypesaWebhook,
} = require("../../controllers/account/Wallet/TinypesaWebhook");
const {
  MpesaDeposit,
} = require("../../controllers/account/Wallet/MpesaDeposit");
const {
  MpesaDepositHistory,
} = require("../../controllers/account/Wallet/DepositHistory");
const {
  WithdrawalHistory,
} = require("../../controllers/account/Wallet/WithdrawalHistory");
const { verifyjwt } = require("../../middleware/verifyjwt");
const formValidate = require("../../middleware/validate");
const { depositSchema, withdrawalSchema } = require("../../yupschemas");

router.post(
  "/mpesa/deposit",
  verifyjwt,
  formValidate(depositSchema),
  MpesaDeposit
);
router.post("/tinypesa/webhook", TinypesaWebhook);
router.post(
  "/withdraw",
  verifyjwt,
  formValidate(withdrawalSchema),
  MpesaWithdraw
);

router.get("/deposit-history", verifyjwt, MpesaDepositHistory);
router.get("/withdrawal-history", verifyjwt, WithdrawalHistory);

module.exports = router;
