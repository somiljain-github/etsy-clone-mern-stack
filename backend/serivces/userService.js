const UserModel = require("../models/userModel");
const ItemModel = require("../models/itemModel");

module.exports = class UserService {
  static async getUser({ userID }) {
    const query = { _id: userID };
    const userObj = {};
    try {
      const result = await UserModel.findOne(query);

      if (result) {
        userObj.userFound = true;
        userObj.user = result;
      } else {
        userObj.userFound = false;
      }
      return userObj;
    } catch (error) {
      console.log(`Could not fetch the user in userService service ${error}`);
    }
  }

  static async getItems({ userID }) {
    const query = { userID };
    const itemObj = {};
    try {
      const result = await ItemModel.findOne(query);

      if (result) {
        itemObj.itemFound = true;
        itemObj.items = result;
      } else {
        itemObj.itemFound = false;
      }
      return itemObj;
    } catch (error) {
      console.log(`Could not fetch the user in userService service ${error}`);
    }
  }

  static async updateUser({ userID, userDetails }) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = userDetails;
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        updateCondition,
        { new: true }
      );
      if (result) {
        return result;
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.updateUser"
      );
    }
  }
};
