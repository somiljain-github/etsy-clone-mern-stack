const UserService = require("../services/userService");
const make_request = require("../kafka/client");
const kafka = require("../kafka/client");

module.exports = class UserController {
  static async getUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    let message = {
      function: "getUser",
      data: userParamsObj,
    };
    kafka.make_request("get-customer-details", message, (err, results) => {
      if (err) {
        console.error(err);
        resp.json({
          status: "Error",
          msg: "System error, try again",
        });
      } else {
        if (results && !results.userFound) {
          console.log(
            "The user with id as",
            userParamsObj.userID,
            "does not exist."
          );
          resp.status(400).send({
            success: false,
            status: 400,
            message: "The user does not exist.",
          });
        }
        resp.status(200).send(results);
        resp.end();
      }
    });
  }

  static async updateUserDetails(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.userDetails = req.body;
    const response = {};
    try {
      let message = { function: "updateUser", data: userParamsObj };
      kafka.make_request("topic-update-user", message, (err, results) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          if (results) {
            response.user = results;
            response.success = true;
            response.status = "200";
            return resp.status(200).send(response);
          } else {
            response.user = results;
            response.success = false;
            response.status = "503";
            response.message = "Database returned null";
            return resp.status(response.status).send(response);
          }
        }
      });
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
      let message = { function: "updateCurrency", data: userParamsObj };
      kafka.make_request("topic-update-currency", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          if (result) {
            response.user = result;
            response.success = true;
            response.status = "200";
            return resp.status(200).send(response);
          } else {
            response.user = results;
            response.success = false;
            response.status = "503";
            response.message = "Database returned null";
            return resp.status(response.status).send(response);
          }
        }
      });
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
      let message = { function: "getFavourites", data: userParamsObj };
      kafka.make_request("topic-get-favourites", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          if (result && result.favouritesFound) {
            response.favouritesFound = result.favouritesFound;
            response.favourites = result.favourites;
            response.favouriteItems = result.favouriteItems;
            response.success = true;
            response.status = "200";
            return resp.status(200).send(response);
          } else {
            response.favouritesFound = result.favouritesFound;
            response.success = false;
            response.status = "404";
            return resp.status(404).send(response);
          }
        }
      });
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
    if (!(userParamsObj.itemID && userParamsObj.userID) && !resp.headersSent) {
      response.success = false;
      response.status = 404;
      response.message = "itemID and userID, both are required";
      resp.status(response.status).send(response);
    }

    try {
      let message = { function: "addFavourites", data: userParamsObj };
      kafka.make_request("topic-add-favourites", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
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
        }
      });
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
      let message = { function: "removeFavourites", data: userParamsObj };
      kafka.make_request("topic-remove-favourites", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
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
        }
      });
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
      let message = { function: "getCartItems", data: userParamsObj };
      kafka.make_request("topic-get-cart-items", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          if (result && result.cartFound) {
            response.cartFound = result.cartFound;
            response.cart = result.cart;
            response.cartItems = result.cartItems
            response.success = true;
            response.status = "200";
            return resp.status(200).send(response);
          } else {
            response.cartFound = result.cartFound;
            response.success = false;
            response.status = "404";
            return resp.status(404).send(response);
          }
        }
      });
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
      let message = { function: "addCartItems", data: userParamsObj };
      kafka.make_request("topic-add-cart-items", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
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
        }
      });
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
      let message = { function: "removeCartItems", data: userParamsObj };
      kafka.make_request("topic-remove-cart-items", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
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
        }
      });
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
      let message = {
        function: "decrementCartItemQuantity",
        data: userParamsObj,
      };
      kafka.make_request(
        "topic-decrement-cart-items",
        message,
        (err, result) => {
          if (err) {
            console.error(err);
            resp.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            // if(result && !result.itemFound){
            //   response.itemFound = result.itemFound;
            //   response.success = true;
            //   response.status = "200";
            // } else 
            if (result) {
              response.cart = result.cart;
              response.success = true;
              response.status = "200";
              response.cartItems = result.cartItems;
              return resp.status(200).send(response);
            } else {
              response.success = false;
              response.status = "404";
              return resp.status(404).send(response);
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  /* ------------------------ increment-cart-item-count ----------------------- */
  static async incrementCartItemQuantity(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.itemID = req.body.itemID;
    const response = {};
    try {
      let message = { function: "incrementCartItemQuantity", data: userParamsObj};
      kafka.make_request("topic-decrement-cart-items", message,
        (err, result) => {
          if (err) {
            console.error(err);
            resp.json({ status: "Error", msg: "System error, try again"});
          } else {
            // if(result && !result.itemFound){
            //   response.itemFound = result.itemFound;
            //   response.success = true;
            //   response.status = "200";
            // } else 
            if (result) {
              response.cart = result.cart;
              response.success = true;
              response.status = "200";
              response.cartItems = result.cartItems;
              return resp.status(200).send(response);
            } else {
              response.success = false;
              response.status = "404";
              return resp.status(404).send(response);
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }


  static async getCategories(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    const response = { categoriesFound: false };
    try {
      let message = { function: "getCategories", data: userParamsObj };
      kafka.make_request("topic-get-categories", message, (err, result) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          if (result && result.categoriesFound) {
            response.categoriesFound = result.categoriesFound;
            response.userDefinedCategories = result.userDefinedCategories;
            response.generalCategories = result.generalCategories;
            response.success = true;
            response.status = "200";
            return resp.status(200).send(response);
          } else {
            response.categoriesFound = result.categoriesFound;
            response.success = false;
            response.status = "404";
            return resp.status(404).send(response);
          }
        }
      });
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }

  static async addUserDefinedCategories(req, resp) {
    const userParamsObj = { userID: req.params.userID };
    userParamsObj.category = req.body.category;
    const response = {};
    try {
      let message = {
        function: "addUserDefinedCategories",
        data: userParamsObj,
      };
      kafka.make_request(
        "topic-add-UserDefinedCategories",
        message,
        (err, result) => {
          if (err) {
            console.error(err);
            resp.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            if (result) {
              response._id = result._id;
              response.userDefinedCategories = result.userDefinedCategories;
              response.success = true;
              response.status = "200";
              return resp.status(200).send(response);
            } else {
              response.success = false;
              response.status = "404";
              return resp.status(404).send(response);
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
      response.success = false;
      response.error = "Some error occurred. Please try again later";
      response.status = "500";
      resp.status(500).send(response);
    }
  }
};
