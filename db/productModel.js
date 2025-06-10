/** @format */

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: String,
  categeory: String,
  userId: String,
  Company: String,
});
module.exports = mongoose.model("products", ProductSchema);
