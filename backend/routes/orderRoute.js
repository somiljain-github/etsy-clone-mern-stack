const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/addOrder", passport.authenticate("jwt", { session: false }), controller.addOrder);
router.get("/getOrders/:userID", passport.authenticate("jwt", { session: false }), controller.getOrders);

module.exports = router;