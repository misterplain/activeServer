const express = require("express");
const router = express.Router();
const collabController = require("../../controllers/bcnMinimalista/collabController");


router.route("/").post(collabController.sendCollab);

module.exports = router;
