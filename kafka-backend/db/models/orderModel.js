const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = new Schema({
  orderid: { type: String },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: [
    {
      itemID: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number },
      giftPacked: { type: Boolean },
      description: { type: String },
    },
  ],
});
const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
