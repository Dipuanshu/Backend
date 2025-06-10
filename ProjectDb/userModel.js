/** @format */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  userName: String,
  query: String,
  replyedQuery: String,
  userId: Number,
  status: String,
  date: Date,
});
module.exports = mongoose.model("users", userSchema);
