const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Auth = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  AuthYn: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = Auth;
