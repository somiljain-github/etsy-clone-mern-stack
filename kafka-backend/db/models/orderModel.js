const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = new Schema({
  orderid: { type: String },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: [
    {
      itemID: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number },
      isGiftPack: { type: Boolean },
      instructions: { type: String },
      displayPicture: { type: String },
      name: { type: String},
      shopName: { type: String },
      price: { type: Number },
      dop: { type: Date },
    },
  ],
});
const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;