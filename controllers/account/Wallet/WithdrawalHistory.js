const Withdrawals = require("../../../models/Withdrawals");
const Messages = require("../../../utils/messages");

const WithdrawalHistory = async (req, res) => {
  try {
    const { userid } = req.body;
    const getWithdrawals = await Withdrawals.find({ userid });

    return res
      .status(200)
      .json({ message: Messages.requestSuccessful, payload: getWithdrawals });
  } catch (error) {
    //console.log(error)
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { WithdrawalHistory };
