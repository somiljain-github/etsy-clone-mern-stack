const express = require("express");
const SERVICE = require("../services/itemService");
const USERSERVICE = require("../services/userService");
const constants = require("../constants.json");
const { uploadFile, getFileStream } = require("../config/s3.config.js");

const ITEMMODEL = constants.models.item;
const USERMODEL = constants.models.user;

module.exports = class itemController {
  static async getAll(req, res) {
    const userID = req.params.userId;
    const queryVal = { $ne: [userID] };
    if (userID) {
      let items = await SERVICE.getItemsbyParamter(ITEMMODEL.userID, queryVal);
      const favItems = await USERSERVICE.getFavourites({ userID });
      console.log(items);
      console.log(favItems);
      let updatedItems = await SERVICE.markFavourteItems(
        items,
        favItems.favourites
      );
      res
        .status(200)
        .send(updatedItems)
        .end();
    } else {
      res.status(400).send({
        status: false,
        data: "UserId missing.",
      });
    }
  }

  static async getItem(req, res) {
    const itemId = req.params.itemId;
    const param = ITEMMODEL.id;
    if (itemId) {
      const items = await SERVICE.getItemsbyParamter(param, itemId);
      res
        .status(200)
        .send(items)
        .end();
    } else {
      res.status(400).send({
        status: false,
        data: "ItemId missing.",
      });
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
        const items = await SERVICE.getItemsbyParamter(param, query);
        res
          .status(200)
          .send(items)
          .end();
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
    const search = req.params.search;

    const param = ITEMMODEL.name;
    const query = { $regex: search, $options: "i" };
    console.log(query);

    if (search) {
      const items = await SERVICE.getItemsbyParamter(param, query);
      res
        .status(200)
        .send(items)
        .end();
    } else {
      res.status(400).send({
        status: false,
        data: "Search phrase missing.",
      });
    }
  }
};
