const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.getUserDetails
);

module.exports = router;
