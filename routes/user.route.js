const express = require("express");
const router = express.Router();
const getDB = require("../utils/database");
const jwt = require("jsonwebtoken");
const verifyJwt = require("../middlewars/VerifyJwt");
const VerifyAdmin = require("../middlewars/VerifyAdmin");
const { ObjectId } = require("mongodb");

// get all user
router.get("/", async (req, res) => {
  const query = {};
  const db = await getDB();
  const users = await db.userCollection.find(query).toArray();
  res.send(users);
});

// create user & generate token
router.put("/:email", async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  console.log(user);
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      email: user.newUser,
    },
  };

  const db = await getDB();
  const result = await db.userCollection.updateOne(filter, updateDoc, options);
  // generate jwt token
  const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_PRIVATE, {
    expiresIn: "7d",
  });
  res.send({ result, token });
});

// update specific user by id
router.patch("/:email", VerifyAdmin, async (req, res) => {
  const id = req.body.id;
  const filter = { _id: ObjectId(id) };
  const updateDoc = {
    $set: {
      role: "admin",
    },
  };

  const db = await getDB();
  const result = await db.userCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// delete specific user by id
router.delete("/:id", verifyJwt, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const result = await db.userCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
