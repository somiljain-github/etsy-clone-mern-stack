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

router.post(
  "/cart/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.addCartItems
);

router.post(
  "/removeFromCart/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.removeCartItems
);

router.post(
  "/decrementCartItemQuantity/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.decrementCartItemQuantity
);

router.post(
  "/incrementCartItemQuantity/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.incrementCartItemQuantity
);

router.get(
  "/getCategories/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.getCategories
);

router.post(
  "/category/add/:userID",
  passport.authenticate("jwt", { session: false }),
  UserController.addUserDefinedCategories
);

module.exports = router;
