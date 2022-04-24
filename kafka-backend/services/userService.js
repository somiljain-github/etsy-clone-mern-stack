const UserModel = require("../db/models/userModel");
const ItemModel = require("../db/models/itemModel");
const ConstantsModel = require("../db/models/constantsModel");

class UserService {
  static async getUser(data, callback) {
    console.log("in the kafka userservice...");
    const userID = data.userID;
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

      if (result.shopName) {
        const data = { userID: result._id.toString() };
        const items = await UserService.getItems(data);
        if (items && items.itemFound) {
          userObj.items = items.items;
        }
      }

      if(result.favourites.length > 0){
        const records = await ItemModel.find().where('_id').in(result.favourites).exec();
        userObj.favouriteItems = records;
      }
      callback(null, userObj);
    } catch (error) {
      console.log(`Could not fetch the user in userService.getUser ${error}`);
    }
  }

  static async getItems({ userID }) {
    const query = { userID };
    const itemObj = {};
    try {
      const result = await ItemModel.find(query);

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

  static async updateUser(data, callback) {
    const userID = data.userID;
    const userDetails = data.userDetails;
    try {
      const filterCondition = { _id: userID };
      const updateCondition = userDetails;
      console.log(filterCondition, updateCondition);
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        updateCondition,
        { new: true }
      );
      if (result) {
        console.log("sending the result form update user", result);
        callback(null, result);
      } else {
        console.log("sending the null form update user", result);
        callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.updateUser"
      );
    }
  }

  static async updateCurrency({ userID, currencyID }, callback) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { currencyID: currencyID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        updateCondition,
        { new: true }
      );
      if (result) {
        callback(null, result);
      } else {
        return callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.updateCurrency"
      );
    }
  }

  static async getFavourites({ userID }, callback) {
    const query = { _id: userID };
    const itemObj = { favouritesFound: false };
    try {
      const result = await UserModel.findById(query).select("favourites");
      if (result) {
        itemObj.favouritesFound = true;
        itemObj.favourites = result.favourites;
      }

      if(result.favourites.length > 0){
        const records = await ItemModel.find().where('_id').in(result.favourites).exec();
        itemObj.favouriteItems = records;
      }
      callback(null, itemObj);
    } catch (error) {
      console.log(
        `Could not fetch the user in userService getFavourites ${error}`
      );
      callback(null, itemObj);
    }
  }

  static async addFavourites({ userID, itemID }, callback) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { favourites: itemID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        { $addToSet: updateCondition },
        { new: true }
      ).select("favourites");
      if (result) {
        callback(null, result);
      } else {
        callback(null, null);
      }
    } catch (err) {
      console.log("-------The error in userService.addFavourites is", err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.addFavourites"
      );
    }
  }

  static async removeFavourites({ userID, itemID }, callback) {
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
        callback(null, result);
      } else {
        callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.removeFavourites"
      );
    }
  }

  static async getCartItems({ userID }, callback) {
    const query = { _id: userID };
    const itemObj = {};
    try {
      const result = await UserModel.findById(query).select("cart");
      console.log(result);
      if (result) {
        itemObj.cartFound = true;
        itemObj.cart = result.cart;
        if(result.cart.length > 0){
          let tempCart = [...result.cart];
          tempCart = [...new Set(tempCart)];
          tempCart.map(itemID => itemID.toString());
          
          const records = await ItemModel.find().where('_id').in(tempCart).exec();
          itemObj.cartItems = records;
        }
      } else {
        itemObj.cartFound = false;
      }
      callback(null, itemObj);
    } catch (error) {
      console.log(
        `Could not fetch the user in userService getCartItems; and the error is ${error}`
      );
      itemObj.cartFound = false;
      callback(null, itemObj);
    }
  }

  static async addCartItems({ userID, itemID }, callback) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { cart: itemID };
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        { $push: updateCondition },
        { new: true }
      ).select("cart");
      if (result) {
        callback(null, result);
      } else {
        callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.addCartItems"
      );
    }
  }

  static async decrementCartItemQuantity({ userID, itemID }, callback) {
    try {
      const filterCondition = { _id: userID };
      const result = await UserModel.findOne(filterCondition).select("cart");
      if (result) {
        let cart = result.cart;
        let idx = cart.findIndex((cartItem) => cartItem == itemID);
        if (idx != -1) {
          cart.splice(idx, 1);
        } else {
          // console.log("****************************");
          // let returnObj = {
          //   itemFound: false
          // }
          // callback(null, returnObj);
          callback(null ,null);
        }
        const updateCondition = { cart };
        try {
          const result = await UserModel.findOneAndUpdate(
            filterCondition,
            updateCondition,
            { new: true }
          ).select("cart");
          if (result) {
            const itemObj = {};
            itemObj.cart = result.cart;
            console.log("the final cart is", itemObj.cart);
            if(result.cart.length > 0){
              let tempCart = [...result.cart];
              tempCart = [...new Set(tempCart)];
              tempCart.map(itemID => itemID.toString());
              const records = await ItemModel.find().where('_id').in(tempCart).exec();
              itemObj.cartItems = records;
            }
            callback(null, itemObj);
          } else {
            console.log("################################");
            callback(null, null);
          }
        } catch (error) {
          console.log(err);
          throw new Error(
            "Some unexpected error occurred in the inner loop while updating cart in userService.decrementCartItemQuantity"
          );
        }
      } else {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
        callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating cart in userService.decrementCartItemQuantity"
      );
    }
  }

  static async removeCartItems({ userID, itemID }, callback) {
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
        callback(null, result);
      } else {
        callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.removeFavourites"
      );
    }
  }

  static async getCategories({ userID }, callback) {
    const query = { _id: userID };
    const itemObj = { categoriesFound: false };
    try {
      const result = await UserModel.findById(query).select(
        "userDefinedCategories"
      );
      const generalCategories = await ConstantsModel.findOne().select(
        "categories"
      );
      if (result) {
        itemObj.categoriesFound = true;
        itemObj.userDefinedCategories = result.userDefinedCategories;
        itemObj.generalCategories = generalCategories.categories;
      }
      callback(null, itemObj);
    } catch (error) {
      console.log(
        `Could not fetch the user in userService getCategories and the error is ${error}`
      );
      callback(null, itemObj);
    }
  }

  static async addUserDefinedCategories({ userID, category }, callback) {
    try {
      const filterCondition = { _id: userID };
      const updateCondition = { userDefinedCategories: category };
      console.log(updateCondition);
      const result = await UserModel.findOneAndUpdate(
        filterCondition,
        { $addToSet: updateCondition },
        { new: true }
      ).select("userDefinedCategories");
      console.log("the result is", result);
      if (result) {
        callback(null, result);
      } else {
        callback(null, null);
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "Some unexpected error occurred while updating user in userService.addUserDefinedCategories"
      );
    }
  }

  static async getUserbyParameter({ param, val }, callback) {
    const query = { [param]: val };
    console.log(query);
    let userObj = {};

    return new Promise(function (resolve, reject) {
      UserModel.findOne(query)
        .then((res) => {
          if (res) {
            userObj = res;
            console.log("INSIDE GET USER", userObj);
            callback(null, userObj);
          } else {
            callback(null, "User does NOT exist with shopName " + val);
          }
        })
        .catch((err) => {
          throw err;
        });
    });
  }
}

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.function === "getUser") {
    console.log("the function is", msg.function);
    UserService.getUser(msg.data, callback);
  } else if (msg.function === "updateUser") {
    UserService.updateUser(msg.data, callback);
  } else if (msg.function === "updateCurrency") {
    UserService.updateCurrency(msg.data, callback);
  } else if (msg.function === "getFavourites") {
    UserService.getFavourites(msg.data, callback);
  } else if (msg.function === "addFavourites") {
    UserService.addFavourites(msg.data, callback);
  } else if (msg.function === "removeFavourites") {
    UserService.removeFavourites(msg.data, callback);
  } else if (msg.function === "getCartItems") {
    UserService.getCartItems(msg.data, callback);
  } else if (msg.function === "addCartItems") {
    UserService.addCartItems(msg.data, callback);
  } else if (msg.function === "removeCartItems") {
    UserService.removeCartItems(msg.data, callback);
  } else if (msg.function === "decrementCartItemQuantity") {
    UserService.decrementCartItemQuantity(msg.data, callback);
  } else if (msg.function === "getCategories") {
    UserService.getCategories(msg.data, callback);
  } else if (msg.function === "addUserDefinedCategories") {
    UserService.addUserDefinedCategories(msg.data, callback);
  } else if (msg.function === "getUserbyParameter") {
    UserService.getUserbyParameter(msg.data, callback);
  }
}

exports.handle_request = handle_request;
