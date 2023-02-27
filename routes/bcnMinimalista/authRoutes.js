const express = require("express");
const router = express.Router();
const authController = require("../../controllers/bcnMinimalista/authController");

router.route("/").post(authController.authUser);
router.post("/register", authController.registerUser);

module.exports = router;
