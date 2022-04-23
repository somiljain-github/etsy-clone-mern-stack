const SERVICE = require("../services/constantsService");
const constants = require("../constants.json");
const kafka = require("../kafka/client");

const MODELS = constants.models;

module.exports = class ConstantsController {
  static async getCountries(req, resp) {
    try {
      let message = { function: "getCountries", data: null };
      kafka.make_request(
        "topic-constants-get-countries",
        message,
        async (err, result) => {
          if (err) {
            console.error(err);
            resp.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            console.log(result);
            if (result) {
              resp
                .status(200)
                .send(result)
                .end();
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  static async getCategories(req, res) {
    try {
      let message = { function: "getCategories", data: null };
      kafka.make_request(
        "topic-constants-get-categories",
        message,
        async (err, result) => {
          if (err) {
            console.error(err);
            resp.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            if (result) {
              console.log(result);
              res
                .status(200)
                .send(result)
                .end();
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  static async getCurrencies(req, res) {
    try {
      let message = { function: "getCurrencies", data: null };
      kafka.make_request(
        "topic-constants-get-currencies",
        message,
        async (err, result) => {
          if (err) {
            console.error(err);
            res.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            console.log(result);
            if (result) {
              res
                .status(200)
                .send(result)
                .end();
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }
};
