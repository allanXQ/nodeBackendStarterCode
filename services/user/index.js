const User = require("../../models/Users");

const findUser = async (params) => {
  return await User.findOne({ params });
};

const createUser = async (params) => {
  return await User.create(params);
};

const updateUser = async ({ identifier, newData }) => {
  return await User.updateOne({ identifier }, { $set: newData });
};

const findOneAndUpdate = async (params) => {
  return await User.findOneAndUpdate({ params });
};

module.exports = { findUser, createUser, updateUser };
