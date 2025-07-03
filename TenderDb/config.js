/** @format */

/** @format */

require("dotenv").config();
const mongoose = require("mongoose");

console.log("MongoDBURI:", process.env.MongoDBURI);

mongoose
  .connect(process.env.MongoDBURI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Failed:", err));
