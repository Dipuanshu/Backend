/** @format */

const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  username: String,
  text: String,
});
const ReelsSchema = new mongoose.Schema({
  reels: String,
  reelsLikes: Number,
  reelsComments: [String],
  reelsCommentCount: Number,
  likedBy: [String],
  comments: [commentSchema],
  saved: Boolean,
});
module.exports = mongoose.model("reels", ReelsSchema);
