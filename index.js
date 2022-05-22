const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
