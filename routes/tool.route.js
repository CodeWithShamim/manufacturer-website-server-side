const express = require("express");
const router = express.Router();
const getDB = require("../utils/database");
const verifyJwt = require("../middlewars/VerifyJwt");
const VerifyAdmin = require("../middlewars/VerifyAdmin");
const { ObjectId } = require("mongodb");

// find all tools
router.get("/", async (req, res) => {
  const query = {};
  const db = await getDB();
  const tools = await db.toolCollection.find(query).toArray();
  res.send(tools.reverse());
});

// find specific data
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const tool = await db.toolCollection.findOne(query);
  res.send(tool);
});

// add new tool
router.post("/", async (req, res) => {
  const tool = req.body;
  console.log(tool);
  const db = await getDB();
  const result = await db.toolCollection.insertOne(tool);
  res.send(result);
});

// delete tool by id
router.delete("/:email", verifyJwt, VerifyAdmin, async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const result = await db.toolCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
