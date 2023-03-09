const express = require("express");
const router = express.Router();
const getDB = require("../utils/database");
const verifyJwt = require("../middlewars/VerifyJwt");

router
  .get("/", async (req, res) => {
    const query = {};
    const db = await getDB();

    const reviews = await db.reviewCollection.find(query).toArray();
    res.send(reviews.reverse());
  })
  .post("/", verifyJwt, async (req, res) => {
    const review = req.body;
    const db = await getDB();
    const result = await db.reviewCollection.insertOne(review);
    res.send(result);
  });

module.exports = router;
