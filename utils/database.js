const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

let client;
const databaseConntect = async () => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c4pos.mongodb.net/?retryWrites=true&w=majority`
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }

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
    return {
      toolCollection,
      orderCollection,
      reviewCollection,
      profileCollection,
      userCollection,
    };
  } catch (error) {
    console.log("DB connect error", error);
  }
};

module.exports = databaseConntect;
