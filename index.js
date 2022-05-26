const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// _____create middleware for verify jwt token_________
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c4pos.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toolCollection = client
      .db("refrigerator_instruments")
      .collection("tools");

    const orderCollection = client
      .db("refrigerator_instruments")
      .collection("orders");
    const reviewCollection = client
      .db("refrigerator_instruments")
      .collection("reviews");
    const profileCollection = client
      .db("refrigerator_instruments")
      .collection("profiles");
    const userCollection = client
      .db("refrigerator_instruments")
      .collection("users");

    // _____________________________________
    // verify admin
    const verifyAdmin = async (req, res, next) => {
      const email = req.params.email;
      const filter = { email: email };
      const user = await userCollection.findOne(filter);
      const isAdmin = user?.role === "admin";
      if (isAdmin) {
        next();
      } else {
        return res.send(false);
      }
    };

    // create user & generate token
    app.put("/user/:email", async (req, res) => {
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
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // generate jwt token
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_PRIVATE,
        { expiresIn: "3h" }
      );
      res.send({ result, token });
    });

    // get all user
    app.get("/user", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });

    // update specific user by id
    app.patch("/user/:email", verifyAdmin, async (req, res) => {
      const id = req.body.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // _____________________________________
    // verify admin
    app.get("/admin/:email", verifyAdmin, async (req, res) => {
      res.send(true);
    });

    // delete specific user by id
    app.delete("/user/:id", verifyJwt, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // find all tools
    app.get("/tool", async (req, res) => {
      const query = {};
      const tools = await toolCollection.find(query).toArray();
      res.send(tools);
    });

    // add new tool
    app.post("/tool", async (req, res) => {
      const tool = req.body;
      console.log(tool);
      const result = await toolCollection.insertOne(tool);
      res.send(result);
    });

    // delete tool by id
    app.delete("/tool/:id", verifyJwt, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toolCollection.deleteOne(query);
      res.send(result);
    });

    // find specific data
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolCollection.findOne(query);
      res.send(tool);
    });

    // purchase order
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // get all order
    app.get("/all-order", async (req, res) => {
      const query = {};
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    });

    // get specific user order
    app.get("/order/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    });

    // get specific order by id
    app.get("/orderItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.findOne(query);
      res.send(order);
    });

    // update payment order by id
    app.patch("/order/:id", async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete specific order
    app.delete("/order/:id", verifyJwt, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    // add review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // get review
    app.get("/review", async (req, res) => {
      const query = {};
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });

    // add profile
    app.put("/profile", async (req, res) => {
      const profile = req.body;
      const filter = { email: profile.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: profile,
      };
      const result = await profileCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // add profile
    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await profileCollection.findOne(query);
      res.send(result);
    });

    // create payment intent for stripe
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// root route
app.get("/", (req, res) => {
  res.send("Ryan refrigerator instrument server is running.......");
});

// listen
app.listen(port, () => {
  console.log("Listening to port is", port);
});
