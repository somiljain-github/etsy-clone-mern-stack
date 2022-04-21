const express = require("express");
const SERVICE = require("../services/itemService");
const USERSERVICE = require("../services/userService");
const constants = require("../constants.json");
const { uploadFile, getFileStream } = require("../config/s3.config.js");
const kafka = require("../kafka/client");

const ITEMMODEL = constants.models.item;
const USERMODEL = constants.models.user;

module.exports = class itemController {
  static async getAll(req, resp) {
    const userID = req.params.userId;
    const queryVal = { $ne: [userID] };
    if (!userID) {
      return resp.status(400).send({
        status: false,
        data: "UserId missing.",
      });
    }
    let data = { param: ITEMMODEL.userID, val: queryVal };
    try {
      let message = { function: "getItemsbyParamter", data: data };
      kafka.make_request("topic-item-get-all-items", message, (err, items) => {
        if (err) {
          console.error(err);
          resp.json({
            status: "Error",
            msg: "System error, try again",
          });
        } else {
          message = { function: "getFavourites", data: { userID } };
          kafka.make_request(
            "topic-item-get-favourites",
            message,
            (err, favItems) => {
              if (err) {
                console.error(err);
                resp.json({
                  status: "Error",
                  msg: "System error, try again",
                });
              } else {
                console.log(items);
                console.log(favItems);
                data = { items, favIds: favItems.favourites };
                message = { function: "markFavourteItems", data };
                console.log("î11111@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", message);
                kafka.make_request(
                  "topic-item-mark-favourites",
                  message,
                  (err, updatedItems) => {
                    if (err) {
                      console.error(err);
                      resp.json({
                        status: "Error",
                        msg: "System error, try again",
                      });
                    } else {
                      resp
                        .status(200)
                        .send(updatedItems)
                        .end();
                    }
                  }
                );
              }
            }
          );
        }
      });
    } catch (error) {
      console.log(
        "some error occured in loginController.js and the error is",
        error
      );
      resp.status(500).json({ error: error });
    }
  }

  static async getItem(req, res) {
    try {
      const itemId = req.params.itemId;
      const param = ITEMMODEL.id;
      if (itemId) {
        let data = { param, val: itemId };
        let message = { function: "getItemsbyParamter", data: data };
        kafka.make_request(
          "topic-item-get-all-items",
          message,
          (err, items) => {
            if (err) {
              console.error(err);
              resp.json({
                status: "Error",
                msg: "System error, try again",
              });
            } else {
              res
                .status(200)
                .send(items)
                .end();
            }
          }
        );
      } else {
        res.status(400).send({
          status: false,
          data: "ItemId missing.",
        });
      }
    } catch (error) {
      console.log(
        "some error occured in loginController.js and the error is",
        error
      );
      res.status(500).json({ error: error });
    }
  }

  static async getItemsAfterFilter(req, res) {
    console.log(req);
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const param = ITEMMODEL.price;
    const query = { $lte: maxPrice, $gte: minPrice };
    console.log(query);

    if (maxPrice && minPrice) {
      try {
        let data = { param, val: query };
        let message = { function: "getItemsbyParamter", data: data };
        kafka.make_request(
          "topic-item-get-items-after-filter",
          message,
          async (err, items) => {
            if (err) {
              console.error(err);
              resp.json({
                status: "Error",
                msg: "System error, try again",
              });
            } else {
              res
                .status(200)
                .send(items)
                .end();
            }
          }
        );
      } catch (err) {
        res.statusMessage = "Something went wrong. Details: " + e;
        res.send(500);
      }
    } else {
      res.status(400).send({
        status: false,
        data: "min and/or max filters missing.",
      });
    }
  }

  static async getItemsAfterSearch(req, res) {
    try {
      const search = req.params.search;
      const param = ITEMMODEL.name;
      const query = { $regex: search, $options: "i" };
      console.log(query);
      if (!search) {
        return res.status(400).send({
          status: false,
          data: "Search phrase missing.",
        });
      }
      let data = { param, val: query };
      let message = { function: "getItemsbyParamter", data };
      kafka.make_request(
        "topic-item-get-items-after-search",
        message,
        async (err, items) => {
          if (err) {
            console.error(err);
            res.json({
              status: "Error",
              msg: "System error, try again",
            });
          } else {
            res
              .status(200)
              .send(items)
              .end();
          }
        }
      );
    } catch (error) {
      console.log(
        "some error occured in loginController.js and the error is",
        error
      );
      res.status(500).json({ error: error });
    }
  }
};
