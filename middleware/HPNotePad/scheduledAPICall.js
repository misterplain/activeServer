const axios = require("axios");
const schedule = require("node-schedule");
const nodeCron = require("node-cron");
const connectDB = require("../../config/connectDB");

function scheduledAPICall() {
  nodeCron.schedule("0 7 * * * ", function logUpdateToServer() {
    // setTimeout(() => {
    //   connectDB();
    //   console.log("connected to DB - scheduledAPICall - Notepad")
    // }, 1000);
    // Do whatever you want in here. Send email, Make  database backup or download data.
    try {
      axios.post("https://activeserver.onrender.com/notepad/data");
      //   console.log("res", res);
    } catch (error) {
      console.log(error)
      console.log("error within scheduledAPICall");
    }
  });
}

module.exports = scheduledAPICall;
