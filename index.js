const express = require("express");
const cors = require("cors");
const defaultRouter = require("./routes/default.route");
const userRouter = require("./routes/user.route");
const profileRouter = require("./routes/profile.route");
const reviewRouter = require("./routes/review.route");
const orderRouter = require("./routes/order.route");
const toolRouter = require("./routes/tool.route");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", defaultRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/tool", toolRouter);

app.get("/", (req, res) => {
  res.send("Server is running.......");
});

app.listen(port, () => {
  console.log("Listening to port is", port);
});
