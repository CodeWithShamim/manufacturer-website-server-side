const express = require("express");
const router = express.Router();
const getDB = require("../utils/database");

router
  .get("/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const db = await getDB();
    const result = await db.profileCollection.findOne(query);
    res.send(result);
  })
  .put("/", async (req, res) => {
    const profile = req.body;
    const filter = { email: profile.email };
    const options = { upsert: true };
    const updateDoc = {
      $set: profile,
    };
    const db = await getDB();
    const result = await db.profileCollection.updateOne(
      filter,
      updateDoc,
      options
    );
    res.send(result);
  });

module.exports = router;
