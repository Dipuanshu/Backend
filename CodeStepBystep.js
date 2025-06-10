/** @format */

const express = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const jwtKey = "e-com"; //ye bhut security se rakhni hoti hai isse jwtkey milte hi koi bhi token janerate kr sakta hai//
require("./db/config");
const SchemaModel = require("./db/SchemaModel");
const ProductSchema = require("./db/productModel");
const productModel = require("./db/productModel");

const App = express();
App.use(express.json());
App.use(cors());
App.post("/register", async (req, res) => {
  const users = SchemaModel(req.body);
  let result = await users.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ result: "no result found" });
    } else {
      res.send({ result, auth: token });
    }
  });
});
App.post("/login", async (req, res) => {
  if (req.body.name && req.body.password) {
    let users = await SchemaModel.findOne(req.body).select("-password");
    if (users) {
      Jwt.sign({ users }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "no result found" });
        } else {
          res.send({ users, auth: token });
        }
      });
    } else {
      res.send("user not found");
    }
  } else {
    res.send("no user found");
  }
});
App.post("/add-product", VerifyToken, async (req, res) => {
  const product = ProductSchema(req.body);
  console.log(product);
  let result = await product.save();
  console.log(result);
  res.send(req.body);
});
App.get("/products", VerifyToken, async (req, res) => {
  const products = await productModel.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send("Product is not found");
  }
});
App.delete("/delete/:id", VerifyToken, async (req, res) => {
  const result = await ProductSchema.deleteOne({ _id: req.params.id });
  res.send(result);
});
App.get("/product/:id", VerifyToken, async (req, res) => {
  const result = await ProductSchema.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send("product not found");
  }
});
App.put("/product/:id", VerifyToken, async (req, res) => {
  const result = await ProductSchema.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});
App.get("/search/:key", VerifyToken, async (req, res) => {
  let result = await productModel.find({
    $or: [
      { name: { $regex: req.params.key } },
      {
        price: { $regex: req.params.key },
      },
      { categeory: { $regex: req.params.key } }, // Fixed typo here: "categeory" to "category"
    ],
  });
  res.send(result);
});

function VerifyToken(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    token = token.split(" ");
    token = token[1]; // Extract the token

    Jwt.verify(token, jwtKey, (err, success) => {
      if (err) {
        res.status(401).send({ result: "Please send a valid token" });
      }
      next(); // Proceed to the next middleware if the token is valid
      console.log("next called");
    });
  } else {
    res.status(400).send({ result: "Please send token with headers" });
  }
}
App.get("/post", async (req, res) => {
  let result = await postModel.find();
  res.send(result);
});

App.listen(5000);
