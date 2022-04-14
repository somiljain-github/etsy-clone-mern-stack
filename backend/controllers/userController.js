const UserService = require("../services/userService");
const UserModel = require("../models/userModel");

module.exports = class UserController {
  static async getUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.userID };

    const userObj = await UserService.getUser(userParamsObj);
    if (userObj && !userObj.userFound) {
      console.log(
        "The user with id as",
        userParamsObj.userID,
        "does not exist."
      );
      resp.status(400).send({
        ...returnMessage,
        success: false,
        status: 400,
        message: "The user does not exist.",
      });
    } else {
      console.log(
        "user with id as",
        userParamsObj.userID,
        "found. Moving ahead with getting respective items"
      );
      if (userObj.user.shopName) {
        const items = await UserService.getItems(userParamsObj);
        if (items && items.itemFound) {
          userObj.user.item = item;
        }
      }
    }
    resp.status(200).send(userObj);
  }

  static async updateUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.userDetails = req.body;
    const response = {};
    try {
      const result = await UserService.updateUser(userParamsObj);
      if (result) {
        response.user = result;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async updateCurrency(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.currencyID = req.body.currencyID;
    const response = {};
    try {
      const result = await UserService.updateCurrency(userParamsObj);
      if (result) {
        response.user = result;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async getFavourites(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    const response = { favouritesFound: false };
    try {
      const result = await UserService.getFavourites(userParamsObj);
      if (result && result.favouritesFound) {
        response.favouritesFound = result.favouritesFound;
        response.favourites = result.favourites;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.favouritesFound = result.favouritesFound;
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async addFavourites(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.itemID = req.body.itemID;
    const response = {};
    try {
      const result = await UserService.addFavourites(userParamsObj);
      if (result) {
        response._id = result._id;
        response.favourites = result.favourites;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }
  static async removeFavourites(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.itemID = req.body.itemID;
    const response = {};
    try {
      const result = await UserService.removeFavourites(userParamsObj);
      if (result) {
        response._id = result._id;
        response.favourites = result.favourites;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async getCartItems(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    const response = { cartFound: false };
    try {
      const result = await UserService.getCartItems(userParamsObj);
      if (result && result.cartFound) {
        response.cartFound = result.cartFound;
        response.cart = result.cart;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.cartFound = result.cartFound;
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async addCartItems(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.itemID = req.body.itemID;
    const response = {};
    try {
      const result = await UserService.addCartItems(userParamsObj);
      if (result) {
        response.cart = result.cart;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async removeCartItems(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.itemID = req.body.itemID;
    const response = {};
    try {
      const result = await UserService.removeCartItems(userParamsObj);
      if (result) {
        response.cart = result.cart;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async decrementCartItemQuantity(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.itemID = req.body.itemID;
    const response = {};
    try {
      const result = await UserService.decrementCartItemQuantity(userParamsObj);
      if (result) {
        response.cart = result.cart;
        response.success = true;
        response.status = "200";
        return resp.status(200).send(response);
      } else {
        response.success = false;
        response.status = "404";
        return resp.status(404).send(response);
      }
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }
};
