const ITEM = require("../db/models/itemModel");
const USER = require("../db/models/userModel");

class ItemService {
  static async addItem(data, callback) {
    const item = new ITEM(data);
    await item
      .save()
      .then((res) => {
        console.log("ITEM ADDED", res);
        callback(null, res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static async updateItem(data, callback) {
    let _id = data.itemId;
    await ITEM.findOneAndUpdate({ _id }, data).then((res) => {
      if (res) {
        console.log("ITEM ADDED");
        callback(null, res);
      } else throw "Item NOT updated. Result: " + res;
    });
  }

  static async getItemsbyParamter({ param, val }, callback) {
    const query = { [param]: val };
    // const query = { userID: "625f849c8fb5cea7f52894e5" };
    console.log("the query in getItemsbyParameter is", query);
    let itemObj = {};
    return new Promise(function (_resolve, _reject) {
      ITEM.find(query)
        .lean()
        .then((res) => {
          if (res) {
            console.log(res.length, "ITEMS LOADED");
            itemObj = res;
            console.log("the items found are", itemObj);
            callback(null, itemObj);
          } else {
            callback(null, "Item NOT loaded. Result: " + res);
          }
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  static async markFavourteItems({ items, favIds }, callback) {
    items.forEach((item, index) => {
      const found = favIds.some((id) => {
        return id === item._id;
      });
      // console.log(found);
      item.favourited = found ? true : false;
    });
    callback(null, items);
  }

  static async getAllItems({ param, val, userID }, callback) {
    const query = { [param]: val };
    let items = {},
      favIds = {};
    try {
      items = await ITEM.find(query).lean();
      // console.log(items);
    } catch (error) {
      console.log(
        "Facing an error in ItemService.getAllItems with an error as",
        error
      );
      callback(null, null);
    }

    try {
      const query1 = { _id: userID };
      const result = await USER.findById(query1).select("favourites");
      if (result) {
        favIds = result.favourites;
      }
    } catch (error) {
      console.log(
        `Could not fetch the favourites in itemService.getAllItems while getting favourites ${error}`
      );
      callback(null, null);
    }

    try {
      items.forEach((item, _index) => {
        const found = favIds.some((id) => {
          return id === item._id;
        });
        item.favourited = found ? true : false;
      });

      callback(null, items);
    } catch (error) {
      console.log(
        `Could not fetch the favourites in itemService.getAllItems while marking favourites and the error is:- ${error}`
      );
      callback(null, null);
    }
    callback(null, null);
  }
}

function handle_request(msg, callback) {
  console.log("the message in handle_request is", msg);
  if (msg.function === "addItem") {
    ItemService.addItem(msg.data, callback);
  } else if (msg.function === "updateItem") {
    ItemService.updateItem(msg.data, callback);
  } else if (msg.function === "getItemsbyParamter") {
    ItemService.getItemsbyParamter(msg.data, callback);
  } else if (msg.function === "markFavourteItems") {
    ItemService.markFavourteItems(msg.data, callback);
  } else if (msg.function === "getAllItems") {
    ItemService.getAllItems(msg.data, callback);
  }
}

exports.handle_request = handle_request;
