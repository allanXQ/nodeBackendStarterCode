const crypto = require("crypto");

const createId = () => {
  return crypto.randomBytes(6).toString("hex");
};

module.exports = createId;
