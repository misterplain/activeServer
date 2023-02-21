const express = require("express");
const router = express.Router();
const logController = require("../../controllers/HPNotePad/logController");

router.post("/", logController.logServerRefresh);

module.exports = router;