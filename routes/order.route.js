const express = require("express");
const router = express.Router();
const getDB = require("../utils/database");
const verifyJwt = require("../middlewars/VerifyJwt");
const { ObjectId } = require("mongodb");

// purchase order
router.post("/", async (req, res) => {
  const order = req.body;
  const db = await getDB();
  const result = await db.orderCollection.insertOne(order);
  res.send(result);
});

// get all order
router.get("/all-order", async (req, res) => {
  const query = {};
  const db = await getDB();
  const orders = await db.orderCollection.find(query).toArray();
  res.send(orders);
});

// get specific order by id
router.get("/orderItem/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const order = await db.orderCollection.findOne(query);
  res.send(order);
});

// get specific user order
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const db = await getDB();
  const orders = await db.orderCollection.find(query).toArray();
  res.send(orders);
});

// update payment order by id
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payment = req.body;
  const filter = { _id: ObjectId(id) };
  const updateDoc = {
    $set: {
      paid: true,
      transactionId: payment.transactionId,
    },
  };
  const db = await getDB();
  const result = await db.orderCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// delete specific order
router.delete("/:id", verifyJwt, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const result = await db.orderCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
