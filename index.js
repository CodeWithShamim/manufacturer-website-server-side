const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

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

    //generate token
    app.get("/token/:email", (req, res) => {
      const email = req.params.email;
      console.log(email);
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_PRIVATE,
        {
          expiresIn: "2h",
        }
      );
      res.send({ token: token });
    });

    // find all parts
    app.get("/tool", async (req, res) => {
      const query = {};
      const tools = await toolCollection.find(query).toArray();
      res.send(tools);
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
    app.get("/order/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    });

    // delete specific order
    app.delete("/order/:id", async (req, res) => {
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
