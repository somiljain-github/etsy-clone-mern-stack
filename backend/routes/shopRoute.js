const express = require("express");
const router = express.Router();
const controller = require("../controllers/shopController");
const imageController = require("../controllers/imageController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createShop
);

router.get(
  "/namecheck/",
  passport.authenticate("jwt", { session: false }),
  controller.checkName
);

router.post(
  "/addItem",
  passport.authenticate("jwt", { session: false }),
  controller.addItem
);
router.post(
  "/updateItem",
  passport.authenticate("jwt", { session: false }),
  controller.updateItem
);
router.get(
  "/:shopName",
  passport.authenticate("jwt", { session: false }),
  controller.getShopDetails
);
router.post(
  "/dp/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  imageController.uploadDp
);
router.get(
  "/dp/:key",
  passport.authenticate("jwt", { session: false }),
  imageController.getDp
);

module.exports = router;
