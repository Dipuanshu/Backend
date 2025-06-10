/** @format */

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const ConnectDb = async () => {
  mongoose.connect("mongodb://localhost:27017/instagram");
  const postSchema = new mongoose.Schema({});
  const product = mongoose.model("posts", postSchema);
  const data = await product.find();
  console.log(data);
};
ConnectDb();
