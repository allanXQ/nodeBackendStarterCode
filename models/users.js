const mongoose = require("mongoose");

const { roles } = require("../config");

const Portfolio = mongoose.Schema({
  ownerId: { type: String, required: true },
  stockName: { type: String, required: true },
  amountOwned: { type: Number, required: true },
});

//add kyc
const Users = mongoose.Schema({
  userid: { type: String },
  role: { type: String, default: roles.user },
  firstname: { type: String },
  lastname: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  accountBalance: { type: Number, default: 0 },
  status: { type: String, default: "inactive" },
  referrer: { type: String, default: "none" },
  refreshToken: { type: String },
  passwordResetToken: { type: String },
  password: { type: String, required: true },
  portfolio: [Portfolio],
  created: { type: Date, default: Date.now },
});

const model = mongoose.model("Users", Users);

module.exports = model;
