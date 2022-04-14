const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let constantsSchema = new Schema({
  countries: [{ type: String }],
  categories: [{ type: String }],
  currencies: [{ type: String }],
});
const constantsModel = mongoose.model("constants", constantsSchema);
module.exports = constantsModel;
