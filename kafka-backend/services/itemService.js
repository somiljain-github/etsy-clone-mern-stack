const ITEM = require("../db/models/itemModel");

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
}

function handle_request(msg, callback) {
  if (msg.function === "addItem") {
    ItemService.addItem(msg.data, callback);
  } else if (msg.function === "updateItem") {
    ItemService.updateItem(msg.data, callback);
  } else if (msg.function === "getItemsbyParamter") {
    ItemService.getItemsbyParamter(msg.data, callback);
  } else if (msg.function === "markFavourteItems") {
    ItemService.markFavourteItems(msg.data, callback);
  }
}

exports.handle_request = handle_request;
