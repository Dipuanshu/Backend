/** @format */

const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  videoUrl: String,
});
module.exports = mongoose.model("explore", Schema);
