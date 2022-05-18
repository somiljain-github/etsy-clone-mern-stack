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
/* --------------------------------- models --------------------------------- */
const UserModel = require("./models/userModel");
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
// app.use("/api/v1/login", loginRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/constants", constantsRoute);
app.use("/api/v1/item", itemRoute);
app.use("/api/v1/order", orderRoute);

//================================GraphQL apis================================
app.post("/api/v1/register", async function(req, res) {
  if (req.body.name && req.body.emailID && req.body.password) {
    var sql = `INSERT INTO user_profile_table (email, name, password) VALUES ('${req.body.email.toUpperCase()}', '${
      req.body.name
    }', '${passwordHash.generate(req.body.password)}');`;
    await connection.query(sql, async function(error, results) {
      if (error) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(error.code);
      } else {
        await connection.query(
          `SELECT * from user_profile_table where UPPER(email)='${req.body.email.toUpperCase()}'`,
          function(error, result) {
            if (error) {
              res.writeHead(500, {
                "Content-Type": "text/plain",
              });
              res.send("Database Error");
            } else {
              const userObj = {
                id: result[0]["rec_id"],
                email: result[0]["email"],
                name: result[0]["name"],
                profilePicture: result[0]["profile_picture_url"],
                phone: result[0]["phone"],
                currency: result[0]["currency"],
                timezone: result[0]["timezone"],
                language: result[0]["language"],
              };
              res.end(JSON.stringify(userObj));
            }
          }
        );
      }
    });
  }
});

app.post("/api/v1/login", async function(req, res) {
  if (req.body.emailID && req.body.password) {
    const query = {
      emailID: req.body.emailID,
      // password: req.body.password,
    };
    console.log(query);
    UserModel.findOne(query)
      .then((result) => {
        const returnMessage = {};
        console.log("------------", result);
        if (result == null) {
          res.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          const passwordMatch = true;
          // await encrypt.comparePassword(
          //   data.password,
          //   result.password
          // );

          if (passwordMatch) {
            const user = JSON.parse(JSON.stringify(result));
            delete user.password;
            const token = jwt.sign(user, process.env.SECRET_KEY, {
              expiresIn: "24h",
            });
            returnMessage.user = user;
            returnMessage.token = token;
            returnMessage.success = true;
            returnMessage.status = 201;
            return res.status(201).send(returnMessage);
          } else {
            returnMessage.success = false;
            returnMessage.status = "400";
            returnMessage.message = "Invalid credentials";
            return res.status(400).send(returnMessage);
          }
        }
      })
      .catch((err) => {
        console.log("error in login:- \n", err);
      });

    


