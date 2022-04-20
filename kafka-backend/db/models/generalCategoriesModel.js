const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let generalCategorySchema = new Schema({
  name: { type: String, required: true },
  displayPicture: { type: String },
  price: { type: Float32Array },
  category: { type: String },
  description: { type: String },
  quantity: { type: Number },
  salesCount: { type: Number },
  shopName: { type: Object, ref: "user", field: "shopName" },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const generalCategoryModel = mongoose.model(
  "generalCategory",
  generalCategorySchema
);
module.exports = generalCategoryModel;
