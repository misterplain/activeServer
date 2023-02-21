const axios = require("axios");
const schedule = require("node-schedule");
const nodeCron = require("node-cron");

function keepServerActive() {

  nodeCron.schedule("*/14 * * * *", function logUpdateToServer() {
    // Do whatever you want in here. Send email, Make  database backup or download data.
    try {
      axios.post(
        "https://activeserver.onrender.com/log"
      );
    //   console.log("res", res);
    } catch (error) {
      console.log(error.message);
    }
  });
}

module.exports = keepServerActive;
