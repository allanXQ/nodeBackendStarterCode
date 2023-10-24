const { default: mongoose } = require("mongoose");
const User = require("../../../models/Users");
const Messages = require("../../../utils/messages");

const TinypesaWebhook = async (req, res) => {
  try {
    const stkCallback = req.body.Body.stkCallback;
    const { CallbackMetadata } = req.body.Body.stkCallback;
    if (stkCallback.ResultCode !== 0) {
      return res.status(400).json({ message: Messages.depositFailed });
    }
    const [Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber] =
      CallbackMetadata.Item.map((item) => item["Value"]);
    const PhoneString = PhoneNumber.toString();

    const session = await mongoose.startSession();
    session.startTransaction();

    await Deposit.create(
      {
        phone: PhoneString,
        amount: Amount,
        mpesaRef: MpesaReceiptNumber,
        created: TransactionDate,
      },
      { session }
    );
    const phoneNumber = PhoneString;
    const userUpdate = await User.findOneAndUpdate(
      { phone: phoneNumber },
      {
        $inc: { balance: Amount },
      },
      { session, new: true }
    );
    if (!userUpdate) {
      return res.status(400).json({ message: Messages.depositFailed });
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: Messages.depositSuccess });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: Messages.serverError });
  }
};

module.exports = { TinypesaWebhook };
