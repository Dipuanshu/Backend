/** @format */

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); // json ko samjhne k liye //

require("./ProjectDb/config");
const projectModel = require("./ProjectDb/userModel");

// ✅ Home Page Route (Add this part)
app.get("/", (req, res) => {
  res.send("Welcome! Your API is working successfully 🚀");
});

// Express route to receive data
app.post("/saved", async (req, res) => {
  const { userName, email, query, userId } = req.body;

  const newUser = new projectModel({
    userName,
    email,
    query,
    userId,
    status: "pending",
    date: Date.now(),
  });
  await newUser.save(); // Save to MongoDB
  res.send({ success: true, message: "Data saved successfully" }); // Always send a response
});

app.get("/queries", async (req, res) => {
  const result = await projectModel.find();
  res.send(result);
});

app.get("/queries/:id", async (req, res) => {
  const result = await projectModel.find({ _id: req.params.id });
  res.send(result);
});

app.get("/query/:id", async (req, res) => {
  const result = await projectModel.find({ userId: req.params.id });
  res.send(result);
});

app.post("/addFields", async (req, res) => {
  try {
    const result = await projectModel.updateMany(
      {},
      { $set: { date: Date.now() } }
    );
    res.send(result);
  } catch (error) {
    console.error("Error updating documents:", error);
    res
      .status(500)
      .send({ success: false, message: "Error updating documents" });
  }
});

app.put("/updateReply/:id", async (req, res) => {
  const result = await projectModel.updateOne(
    { _id: req.params.id },
    { $set: { replyedQuery: req.body.replyedQuery, status: "resolved" } }
  );
  res.send(result);
});

// Use process.env.PORT for Render/Railway compatibility
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
