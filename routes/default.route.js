const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const VerifyAdmin = require("../middlewars/VerifyAdmin");

// verify admin
router.get("/admin/:email", VerifyAdmin, async (req, res) => {
  res.send(true);
});

router.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

module.exports = router;