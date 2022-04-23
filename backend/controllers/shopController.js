const SERVICE = require("../services/shopService");
const ITEMSERVICE = require("../services/itemService");
const USERSERVICE = require("../services/userService");
const constants = require("../constants.json");
const kafka = require("../kafka/client");

const MODELS = constants.models;

module.exports = class ShopController {
  //check if shop exists, if not create shop
  static async createShop(req, res) {
    let { shopName, userID } = req.body;
    let data = { shopName, userID: userID };
    try {
      let message = { function: "addShop", data };
      kafka.make_request("topic-shop-exists", message, async (err, result) => {
        if (err && res.headersSent !== true) {
          console.error(err);
          return res.json({ status: "Error", msg: "System error, try again" });
        } else {
          if (res.headersSent !== true) {
            if (result.doesUserHaveShopName) {
              res.status(405).send({
                ...result,
                message: "the user already has a shopName",
              });
            } else if (!result.isShopNameUnique) {
              res.status(405).send({
                ...result,
                message: "The shopName is already taken by someone else",
              });
            } else {
              res.status(200).send(result);
            }
          }
        }
      });
    } catch (e) {
      res.statusMessage = e;
      return res.sendStatus(500);
    }
  }

  //add itemId to USER, add item details to ITEM
  static async addItem(req, res) {
    const item = req.body;
    try {
      let message = { function: "addItem", data: item };
      kafka.make_request(
        "topic-shop-add-item",
        message,
        async (err, result) => {
          if (err && res.headersSent !== true) {
            console.error(err);
            return res.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            console.log(
              "the result recieved in shopController.addItem is",
              result
            );
            res.statusMessage = "ITEM CREATED";
            res.sendStatus(200).end();
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  static async updateItem(req, res) {
    const item = req.body;
    try {
      let message = { function: "updateItem", data: item };
      kafka.make_request(
        "topic-shop-update-item",
        message,
        async (err, result) => {
          if (err && res.headersSent !== true) {
            console.error(err);
            return res.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            console.log(
              "the result recieved in shopController.updateItem is",
              result
            );
            res.statusMessage = "ITEM UPDATED";
            res.sendStatus(200).end();
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  //get shop details (shopName, shopDp), owner details(), items(list of item objects)
  static async getShopDetails(req, res) {
    const shopName = req.params.shopName;
    const shopDetailsObjs = {};

    let data = { param: MODELS.user.shopName, val: shopName };
    try {
      let message = { function: "getUserbyParameter", data };
      kafka.make_request(
        "topic-shop-get-user-details",
        message,
        async (err, result) => {
          if (err && res.headersSent !== true) {
            console.error(err);
            return res.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            if (result) {
              shopDetailsObjs.owner = result;
              console.log("AFTER GET OWNER", shopDetailsObjs);
            }
            data.param = MODELS.item.userID;
            data.val = shopDetailsObjs.owner._id;
            message = { function: "getItemsbyParamter", data };
            kafka.make_request(
              "topic-shop-get-user-items",
              message,
              async (err, result) => {
                if (err && res.headersSent !== true) {
                  console.error(err);
                  return res.json({
                    status: "Error",
                    msg: "System error, try again",
                  });
                } else {
                  if (result) {
                    shopDetailsObjs.items = result;
                    console.log("AFTER GET ITEMS", shopDetailsObjs);
                    res
                      .status(200)
                      .send(shopDetailsObjs)
                      .end();
                  }
                }
              }
            );
          }
        }
      );

      console.log("hereee");
      //get single object of user
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.send(500);
    }
  }


  static async checkName(req, resp){
    const shopName = req.query.shopName;
    if((!shopName) && res.headersSent !== true){
      return resp.status(404).send({message: "All the inputs - userID and shopName are required"});
    }

    try {
      const data = { shopName }
      let message = { function: "checkName", data: data };
      console.log("the message is", message);
      kafka.make_request("topic-check-shopName-unique",message,
        async (err, response) => {
          if (err) {
            console.error(err);
            resp.json({status: "Error", message: "System error, try again"});
          } else {
            if(!response){
              let msg = "the response object recived in itemController.checkName is" + response;
              console.log(msg);
              resp.status(404).send({message: msg});
            } else {
              response.status = 200;
              resp.status(response.status).send(response);
            }
          }
        })
    } catch (error) {
      resp.statusMessage = "Something went wrong. Details: " + e;
      resp.send(500);
    }
  }


};
