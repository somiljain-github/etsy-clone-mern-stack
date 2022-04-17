const SERVICE = require("../services/constantsService");
const constants = require("../constants.json");

const MODELS = constants.models;

module.exports = class ConstantsController {
  static async getCountries(req, res) {
    try {
      const result = await SERVICE.getCountries();
      console.log(result);
      if (result) {
        res
          .status(200)
          .send(result)
          .end();
      }
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  static async getCategories(req, res) {
    try {
      const result = await SERVICE.getCategories();
      console.log(result);
      if (result) {
        res
          .status(200)
          .send(result)
          .end();
      }
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  static async getCurrencies(req, res) {
    try {
      const result = await SERVICE.getCurrencies();
      console.log(result);
      if (result) {
        res
          .status(200)
          .send(result)
          .end();
      }
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }
};
