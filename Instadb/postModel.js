/** @format */

const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  user: String,
  profilePicture: String,
  likes: Number,
  commentCount: Number,
  post: String,
  isLiked: [],
  comments: [String],
  following: [String],
  followers: [String],
  followingCount: Number,
  followersCount: Number,
});
module.exports = mongoose.model("posts", Schema);
