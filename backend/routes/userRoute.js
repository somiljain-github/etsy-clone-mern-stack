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

router.put(
  "/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.updateUserDetails
);

router.put(
  "/updatecurrency/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.updateCurrency
);

router.get(
  "/getFav/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.getFavourites
);

router.put(
  "/addFav/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.addFavourites
);

router.put(
  "/removeFav/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.removeFavourites
);

router.get(
  "/cart/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.getCartItems
);

module.exports = router;
