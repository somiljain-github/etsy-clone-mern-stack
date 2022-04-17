const USER = require("../models/userModel");

module.exports = class ShopService {
  static async shopExists(shopName) {
    let result = USER.find({ shopName }).exec();
    console.log(result);
    return result;
  }

  static async addShop(id, shopName) {
    await USER.updateOne(
      { _id: id },
      { $set: { shopName: shopName } },
      { upsert: true }
    )
      .then((res) => {
        console.log(res);
        if (res) console.log("Shop", shopName, "created.");
        else throw "Shop NOT created. Result: " + res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
