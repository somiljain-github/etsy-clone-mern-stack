const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  name: { type: String, required: true },
  displayPicture: { type: String },
  price: { type: Float32Array },
  category: { type: String },
  description: { type: String },
  quantity: { type: Number },
  salesCount: { type: Number },
  // shopName: { type: Object, ref: "user", field: "shopName" },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const itemModel = mongoose.model("item", itemSchema);
module.exports = itemModel;
