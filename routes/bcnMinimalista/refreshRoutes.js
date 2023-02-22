const express = require("express");
const router = express.Router();
const authController = require("../../controllers/bcnMinimalista/authController");

router.route("/").get(authController.refresh);

module.exports = router;