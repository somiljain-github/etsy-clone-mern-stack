const MODEL = require("../db/models/constantsModel");

class ConstantsService {
  static async getCountries(_data, callback) {
    let resultObj = {};
    const result = await MODEL.find({});
    if (result) {
      resultObj = result[0].countries;
      console.log("Countries", result[0].countries, "found.");
    } else throw "Countries NOT found. Result: " + res;
    callback(null, resultObj);
  }

  static async getCategories(_data, callback) {
    let resultObj = {};
    const result = await MODEL.find({});
    if (result) {
      resultObj = result[0].categories;
      console.log("Countries", result[0].countries, "found.");
    } else throw "Countries NOT found. Result: " + res;
    callback(null, resultObj);
  }

  static async getCurrencies(_data, callback) {
    let resultObj = {};
    const result = await MODEL.find({});
    if (result) {
      resultObj = result[0].currencies;
      console.log("Countries", result[0].countries, "found.");
    } else throw "Countries NOT found. Result: " + res;
    callback(null, resultObj);
  }
}

function handle_request(msg, callback) {
  if (msg.function === "getCountries") {
    ConstantsService.getCountries(msg.data, callback);
  } else if (msg.function === "getCategories") {
    ConstantsService.getCategories(msg.data, callback);
  } else if (msg.function === "getCurrencies") {
    ConstantsService.getCurrencies(msg.data, callback);
  }
}

exports.handle_request = handle_request;
