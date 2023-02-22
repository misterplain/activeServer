const express = require("express");
const router = express.Router();
const authController = require("../../controllers/bcnMinimalista/authController");
const { protect } = require("../../middleware/bcnMinimalista/authMiddleware");

router.use(protect)

router.post("/", authController.logout);

module.exports = router;