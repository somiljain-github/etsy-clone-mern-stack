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
      console.log(`Could not fetch the user in userService.getUser ${error}`);
    }
  }

  static async getItems({ userID }) {
    const query = { userID };
    const itemObj = {};
    try {
      const result = await ItemModel.findById(query);

      if (result) {
        itemObj.itemFound = true;
        itemObj.items = result;
      } else {
        itemObj.itemFound = false;
      }
      return itemObj;
    } catch (error) {
      console.log(`Could not fetch the item in userService getItems ${error}`);
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
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.updateUser"
      );
    }
  }

  static async updateCurrency({ userID, currencyID }) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { currencyID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        updateCondition,
        { new: true }
      );
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.updateCurrency"
      );
    }
  }

  static async getFavourites({ userID }) {
    const query = { _id: userID };
    const itemObj = { favouritesFound: false };
    try {
      const result = await UserModel.findById(query).select("favourites");
      if (result) {
        itemObj.favouritesFound = true;
        itemObj.favourites = result.favourites;
      }
      return itemObj;
    } catch (error) {
      console.log(
        `Could not fetch the user in userService getFavourites ${error}`
      );
      return itemObj;
    }
  }

  static async addFavourites({ userID, itemID }) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { favourites: itemID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        { $addToSet: updateCondition },
        { new: true }
      ).select("favourites");
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.addFavourites"
      );
    }
  }

  static async removeFavourites({ userID, itemID }) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { favourites: itemID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        {
          $pull: updateCondition,
        },
        { new: true }
      ).select("favourites");
      console.log("the result is", result);
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.removeFavourites"
      );
    }
  }

  static async getCartItems({ userID }) {
    const query = { _id: userID };
    const itemObj = {};
    try {
      const result = await UserModel.findById(query).select("cart");
      console.log(result);
      if (result) {
        itemObj.cartFound = true;
        itemObj.cart = result.cart;
      } else {
        itemObj.cartFound = false;
      }
      return itemObj;
    } catch (error) {
      console.log(
        `Could not fetch the user in userService getCartItems; and the error is ${error}`
      );
      itemObj.cartFound = false;
      return itemObj;
    }
  }

  static async addCartItems({ userID, itemID }) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { cart: itemID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        { $push: updateCondition },
        { new: true }
      ).select("cart");
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.addCartItems"
      );
    }
  }

  static async decrementCartItemQuantity({ userID, itemID }) {
    try {
      const filterCondition = { _id: userID };
      const result = await UserModel.findOne(filterCondition).select("cart");
      if (result) {
        let cart = result.cart;
        let idx = cart.findIndex((cartItem) => cartItem == itemID);
        if (idx != -1) {
          cart.splice(idx, 1);
        } else {
          return null;
        }
        const updateCondition = { cart };
        try {
          const result = await UserModel.findOneAndUpdate(
            filterCondition,
            updateCondition,
            { new: true }
          ).select("cart");
          if (result) {
            console.log("the final cart is", result.cart);
            return result;
          } else {
            return null;
          }
        } catch (error) {
          console.log(err);
          throw new Error(
            "Some unexpected error occurred in the inner loop while updating cart in userService.decrementCartItemQuantity"
          );
        }
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating cart in userService.decrementCartItemQuantity"
      );
    }
  }

  static async removeCartItems({ userID, itemID }) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { cart: itemID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        {
          $pull: updateCondition,
        },
        { new: true }
      ).select("cart");
      console.log("the result is", result);
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.removeFavourites"
      );
    }
  }
};
