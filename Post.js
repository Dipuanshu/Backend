/** @format */

const express = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const jwtKey = "instagram";
const app = express();
app.use(cors());
app.use(express.json());
require("./Instadb/config");

const postModel = require("./Instadb/postModel");
const storyModel = require("./Instadb/storyModel");
const usersModel = require("./Instadb/usersModel");
const exploreModel = require("./Instadb/exploreModel");
const reelsModel = require("./Instadb/reelsModel");

app.get("/post", VerifyToken, async (req, res) => {
  const result = await postModel.find();
  res.send(result);
});
app.get("/stories", VerifyToken, async (req, res) => {
  const result = await storyModel.find();
  res.send(result);
});
app.put("/updatePost", async (req, res) => {
  console.log(req.body);
  let result = await postModel.updateOne(
    { _id: req.body.id },
    { $set: req.body }
  );
  res.send(result);
});
app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let users = await usersModel.findOne(req.body).select("-password");
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

app.post("/register", async (req, res) => {
  const users = usersModel(req.body);
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
function VerifyToken(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    token = token.split(" "); //Token ko break krega " " hisab se jha space hoga wha se break kr dega//
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
app.put("/updateLike", async (req, res) => {
  let result = await postModel.updateOne(
    { _id: req.body.id },
    { $set: { isLiked: "" } }
  );
  res.send(result);
});
app.put("/updateComments", async (req, res) => {
  console.log(req.body);
  let result = await postModel.updateOne(
    { user: req.body.user },
    { $push: req.body }
  );
  res.send(result);
  console.log(result);
});
app.get("/Comments/:id", async (req, res) => {
  const result = await postModel.find({ _id: req.params.id });
  res.send(result);
});
app.put("/updateFollowers", async (req, res) => {
  const result = await postModel.updateOne(
    { _id: req.body.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});
app.put("/removeFollowers", async (req, res) => {
  try {
    const result = await postModel.updateOne(
      { _id: req.body.id },
      { $pull: { followers: req.body.FollowersName } } // Remove directly
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
app.get("/explore", async (req, res) => {
  const result = await exploreModel.find();
  res.send(result);
});
app.get("/reels", async (req, res) => {
  const result = await reelsModel.find();
  res.send(result);
});
app.put("/addReelsFields/:postId", async (req, res) => {
  const { username, text } = req.body;
  try {
    const post = await reelsModel.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ username, text });
    await post.save();

    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/updateReels", async (req, res) => {
  console.log(req.body);
  const result = await reelsModel.updateOne(
    { _id: req.body.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});
app.put("/updateReelsLikes", async (req, res) => {
  console.log(req.body);
  try {
    const { id, likedBy, reelsLikes } = req.body;

    const post = await reelsModel.findById(id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const result = await reelsModel.updateOne(
      { _id: id },
      { $set: { reelsLikes: reelsLikes } }
    );

    if (
      !post.likedBy ||
      post.likedBy.length === 0 ||
      !post.likedBy.includes(likedBy)
    ) {
      // Add like
      const result = await reelsModel.updateOne(
        { _id: id },
        { $set: { likedBy: likedBy } } // $addToSet prevents duplicates
      );
      res.send({ message: "Liked", result });
    } else {
      // Remove like (unlike)
      const result = await reelsModel.updateOne(
        { _id: id },
        { $pull: { likedBy: likedBy } }
      );
      res.send({ message: "Unliked", result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
app.get("/getComment/:id", async (req, res) => {
  console.log(req.body);
  const result = await reelsModel.find({ _id: req.params.id });
  res.send(result);
});
app.put("/addField", async (req, res) => {
  const result = await reelsModel.updateMany({}, { $set: { saved: false } });
  res.send(result);
});
app.put("/updateSaveField", async (req, res) => {
  console.log(req.body.save);
  const result = await reelsModel.updateOne(
    { _id: req.body.id },
    { $set: { saved: req.body.save } }
  );
  res.send(result);
});
app.listen(5000);
