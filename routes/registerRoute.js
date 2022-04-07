const express = require("express");
const router = express.Router();
const RegisterController = require("../controllers/registerController");

router.post("/", RegisterController.insertUser);

module.exports = router;
