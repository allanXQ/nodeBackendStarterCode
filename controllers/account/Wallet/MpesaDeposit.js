const WalletConfig = require("../../../config/wallet");
const Messages = require("../../../utils/messages");

const MpesaDeposit = async (req, res) => {
  const { phone, amount } = req.body;
  const { minDeposit, maxDeposit } = WalletConfig;
  if (parseInt(amount) < minDeposit) {
    return res.status(400).json({
      message: Messages.minDeposit + " " + minDeposit,
    });
  }

  if (parseInt(amount) > maxDeposit) {
    return res.status(400).json({
      message: Messages.maxDeposit + " " + maxDeposit,
    });
  }
  const url = " https://tinypesa.com/api/v1/express/initialize";
  await axios({
    method: "post",
    url: url,
    data: {
      amount: amount,
      msisdn: phone,
    },
    headers: {
      Apikey: process.env.TINYPESA_KEY,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        res.status(200).json({
          message: Messages.stkPushSent,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: Messages.serverError });
    });
};

module.exports = { MpesaDeposit };
