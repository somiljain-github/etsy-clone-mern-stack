var connection = new require("./kafka/Connection");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const RegisterService = require("./services/registerService");
const LoginService = require("./services/loginService");
const UserService = require("./services/userService");
const ShopService = require("./services/shopService");
const ItemService = require("./services/itemService");
const OrderService = require("./services/orderService");
const ConstantsService = require("./services/constantsService");

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log(data);
      });
      return;
    });
  });
}

//================================connecting to mongoDB================================
dotenv.config();

const USERNAME = encodeURIComponent(process.env.USERNAME);
const PASSWORD = encodeURIComponent(process.env.PASSWORD);
const CLUSTER = process.env.CLUSTER;
const DBNAME = process.env.DBNAME;

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

//================================end of connection to mongoDB================================

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("topic-register", RegisterService);

handleTopicRequest("topic-login", LoginService);

handleTopicRequest("get-customer-details", UserService);
handleTopicRequest("topic-update-user", UserService);
handleTopicRequest("topic-update-currency", UserService);
handleTopicRequest("topic-get-favourites", UserService);
handleTopicRequest("topic-add-favourites", UserService);
handleTopicRequest("topic-remove-favourites", UserService);
handleTopicRequest("topic-get-cart-items", UserService);
handleTopicRequest("topic-add-cart-items", UserService);
handleTopicRequest("topic-remove-cart-items", UserService);
handleTopicRequest("topic-decrement-cart-items", UserService);
handleTopicRequest("topic-get-categories", UserService);

handleTopicRequest("topic-login", LoginService);

handleTopicRequest("topic-shop-exists", ShopService);
handleTopicRequest("topic-check-shopName-unique", ShopService);


handleTopicRequest("topic-shop-add-item", ItemService);
handleTopicRequest("topic-shop-update-item", UserService);
handleTopicRequest("topic-shop-get-user-details", UserService);
handleTopicRequest("topic-shop-get-user-items", ItemService);

handleTopicRequest("topic-constants-get-countries", ConstantsService);
handleTopicRequest("topic-constants-get-categories", ConstantsService);
handleTopicRequest("topic-constants-get-currencies", ConstantsService);

handleTopicRequest("topic-item-get-all-items", ItemService);
handleTopicRequest("topic-item-get-favourites", UserService);
handleTopicRequest("topic-item-mark-favourites", ItemService);
handleTopicRequest("topic-item-get-items-after-search", ItemService);
handleTopicRequest("topic-item-get-items-after-filter", ItemService);
handleTopicRequest("topic-item-get-item", ItemService);

handleTopicRequest("topic-order-add-order", OrderService);
handleTopicRequest("topic-order-get-orders", OrderService);