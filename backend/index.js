//================================imports================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("./config/passport-config");
//================================importing routes================================
const testAPI = require("./routes/test_route");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const userRoute = require("./routes/userRoute");
const shopRoute = require("./routes/shopRoute");
const constantsRoute = require("./routes/constantsRoute");
const itemRoute = require("./routes/itemRoute");
const orderRoute = require("./routes/orderRoute");
//================================start of config================================
dotenv.config();

const PORT = process.env.PORT || 3001;
const USERNAME = encodeURIComponent(process.env.USERNAME);
const PASSWORD = encodeURIComponent(process.env.PASSWORD);
const CLUSTER = process.env.CLUSTER;
const DBNAME = process.env.DBNAME;

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_IP_ADDRESS,
      process.env.LOCALHOST_FRONTEND_IP_ADDRESS,
    ],
    // methods: ["GET", "POST"],
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//================================connecting to mongoDB================================
const mongoURI = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;
const localMongoURI = `mongodb://127.0.0.1:27017/${DBNAME}`;
let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 500,
  wtimeoutMS: 2500,
};

mongoose.connect(mongoURI, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  }
});

mongoose.connection.on("connecting", () => {
  console.log(
    "connecting to mongoDB...and the readyState is",
    mongoose.connection.readyState
  );
});
mongoose.connection.on("connected", () => {
  console.log(
    "connected to mongoDB...and the readyState is",
    mongoose.connection.readyState
  );
});
mongoose.connection.on("disconnecting", () => {
  console.log(
    "disconnecting to mongoDB...and the readyState is",
    mongoose.connection.readyState
  );
});
mongoose.connection.on("disconnected", () => {
  console.log(
    "disconnected to mongoDB...and the readyState is",
    mongoose.connection.readyState
  );
});

//================================sample api to test the server================================
app.use("/api/v1/", testAPI);
//================================actual apis================================
app.use("/api/v1/register", registerRoute);
app.use("/api/v1/login", loginRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/constants", constantsRoute);
app.use("/api/v1/item", itemRoute);
app.use("/api/v1/order", orderRoute);
