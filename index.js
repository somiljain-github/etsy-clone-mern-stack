//================================imports================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
//================================importing routes================================
const testAPI = require("./routes/test_route");
//================================start of config================================
dotenv.config();

const PORT = process.env.PORT || 3001;
const USERNAME = encodeURIComponent(process.env.USERNAME);
const PASSWORD = encodeURIComponent(process.env.PASSWORD);
const CLUSTER = process.env.CLUSTER;
const DBNAME = process.env.DBNAME;

const app = express();
app.use(express.json());

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
mongoose.connect(
  `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}.mongodb.net/${DBNAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
);

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
//================================sample api================================
app.use("/", testAPI);
//================================actual api================================
