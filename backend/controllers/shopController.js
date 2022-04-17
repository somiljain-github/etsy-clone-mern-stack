const SERVICE = require("../services/shopService");
const ITEMSERVICE = require("../services/itemService");
const USERSERVICE = require("../services/userService");
const constants = require("../constants.json");

const MODELS = constants.models;

module.exports = class ShopController {
  //check if shop exists, if not create shop
  static async createShop(req, res) {
    let { shopName, id } = req.body;

    try {
      let shopExisits = await SERVICE.shopExists(shopName);
      if (shopExisits === []) {
        console.log(".");
        res.statusMessage = "Shop name already taken by a user";
        res.sendStatus(409).end();
      } else {
        await SERVICE.addShop(id, shopName);
        res.statusMessage = "SHOP " + shopName + " CREATED";
        res.sendStatus(200).end();
      }
    } catch (e) {
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  //add itemId to USER, add item details to ITEM
  static async addItem(req, res) {
    const item = req.body;
    console.log(item);
    try {
      await ITEMSERVICE.addItem(item);
      res.statusMessage = "ITEM CREATED";
      res.sendStatus(200).end();
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.sendStatus(500);
    }
  }

  static async updateItem(req, res) {
    const item = req.body;
    //console.log(item);
    try {
      await ITEMSERVICE.updateItem(item);
      res.statusMessage = "ITEM UPDATED";
      res.sendStatus(200).end();
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

    try {
      //get single object of user
      await USERSERVICE.getUserbyParameter(MODELS.user.shopName, shopName)
        .then((result) => {
          if (result) {
            shopDetailsObjs.owner = result;
            console.log("AFTER GET OWNER", shopDetailsObjs);
            //use userid to get items from ITEM collection
            ITEMSERVICE.getItemsbyParamter(
              MODELS.item.userID,
              shopDetailsObjs.owner._id
            )
              .then((result) => {
                if (result) {
                  shopDetailsObjs.items = result;
                  console.log("AFTER GET ITEMS", shopDetailsObjs);
                  res
                    .status(200)
                    .send(shopDetailsObjs)
                    .end();
                }
              })
              .catch((err) => {
                throw err;
              }); //end GET ITEMS
          }
        })
        .catch((err) => {
          throw err;
        });
      //console.log(result);
    } catch (e) {
      console.log(e);
      res.statusMessage = e;
      res.send(500);
    }
  }
};
