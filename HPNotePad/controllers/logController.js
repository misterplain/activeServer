const Log = require("../models/logModel");
const asyncHandler = require("express-async-handler");

// @desc    Create a log
// @route   POST /api/log
// @access  Public
const logServerRefresh = asyncHandler(async (req, res) => {
  let date = new Date();

  const log = await Log.create({
    date,
  });

  if (!log) {
    res.status(400);
    throw new Error("Invalid log data");
  } else {
    console.log("log created every 12 minutes");
  }

  const createdLog = await log.save();
  res.status(201).json(createdLog);
});

module.exports = { logServerRefresh };
