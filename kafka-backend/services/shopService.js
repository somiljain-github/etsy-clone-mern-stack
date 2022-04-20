const USER = require("../db/models/userModel");

class ShopService {
  /**
   * addShop adds the shopName to the database and returns the the response object correctly
   */
  static async addShop({ userID, shopName }, callback) {
    const response = {
      success: false,
      doesUserHaveShopName: false,
      isShopNameUnique: false,
      shopNameAdded: false,
    };
    /**
     * shopPresent return true if the shopName already exists
     */
    const query = { _id: userID };
    let result = await USER.findOne(query).select("shopName");
    if (result.shopName) {
      response.doesUserHaveShopName = true;
      callback(null, response);
    } else {
      result = await USER.find({ shopName }).exec();
      if (result.length > 0) {
        callback(null, response);
      } else {
        response.isShopNameUnique = true;
        await USER.updateOne(
          { _id: userID },
          { $set: { shopName } },
          { upsert: true, new: true }
        )
          .then((res) => {
            console.log(res);
            if (res) {
              console.log("Shop", shopName, "created.");
              response.shopNameAdded = true;
              response.success = true;
              callback(null, response);
            } else {
              callback(null, null);
              throw "Shop NOT created. Result: " + res;
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    }
  }
}

function handle_request(msg, callback) {
  if (msg.function === "addShop") {
    console.log("calling addShop");
    ShopService.addShop(msg.data, callback);
  }
}

exports.handle_request = handle_request;
