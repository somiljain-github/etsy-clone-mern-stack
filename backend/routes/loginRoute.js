const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/loginController");

router.post("/", LoginController.loginUser);

module.exports = router;
