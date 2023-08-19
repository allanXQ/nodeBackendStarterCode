const { default: mongoose } = require("mongoose");
const WalletConfig = require("../../../config/wallet");
const Messages = require("../../../utils/messages");

const MpesaWithdraw = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const { minWithdrawal, withdrawalFeePercentage } = WalletConfig;
    let intAmount = parseInt(amount);
    const getUser = await User.findOne({ phone });
    if (!getUser) {
      return res.status(400).json({ message: Messages.userNotFound });
    }
    const getBalance = parseInt(getUser.balance);
    const username = getUser.username;
    const taxAmount = intAmount * withdrawalFeePercentage;
    const totalAmount = intAmount + taxAmount;

    if (getBalance < minWithdrawal) {
      return res.status(400).json({
        message: Messages.insufficientBalance,
      });
    }

    if (intAmount < minWithdrawal) {
      return res.status(400).json({
        message: Messages.minWithdrawal + ` ${minWithdrawal}`,
      });
    }

    if (intAmount > getBalance) {
      return res.status(400).json({
        message: Messages.insufficientBalance,
      });
    }

    if (getBalance - totalAmount < 0) {
      return res.status(400).json({
        message: Messages.insufficientBalance,
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    await Withdraw.create(
      {
        username,
        phone,
        amount: intAmount,
      },
      { session }
    );
    const updateUser = await User.updateOne(
      { username },
      {
        $inc: { balance: -totalAmount },
      },
      { session, new: true }
    );
    if (updateUser.nModified === 0) {
      return res.status(400).json({ message: Messages.withdrawalFailed });
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: Messages.withdrawalSuccess });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: Messages.serverError });
  }
};

module.exports = { MpesaWithdraw };
