/** @format */

const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  user: String,
  profilePicture: String,
  story: String,
});
module.exports = mongoose.model("stories", Schema);
