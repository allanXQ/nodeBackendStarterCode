const mongoose = require("mongoose");

const Withdrawals = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: Number, required: true },
  mode: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  created: { type: Date, default: Date.now },
});

const model = mongoose.model("Withdrawals", Withdrawals);

module.exports = model;
