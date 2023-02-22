const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/bcnMinimalista/registerController");

router.post("/", registerController.registerUser);

module.exports = router;