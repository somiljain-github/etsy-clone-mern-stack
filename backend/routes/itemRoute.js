const express = require("express");
const router = express.Router();
const controller = require("../controllers/itemController");
const imageController = require("../controllers/imageController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

router.get(
  "/getAll/:userID",
  passport.authenticate("jwt", { session: false }),
  // controller.getAll
  controller.getAllItems
);
router.get(
  "/search/:search?",
  passport.authenticate("jwt", { session: false }),
  controller.getItemsAfterSearch
);
router.get(
  "/filter",
  passport.authenticate("jwt", { session: false }),
  controller.getItemsAfterFilter
);
router.get(
  "/:itemId",
  passport.authenticate("jwt", { session: false }),
  controller.getItem
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
