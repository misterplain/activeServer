const axios = require("axios");
const schedule = require("node-schedule");
const nodeCron = require("node-cron");

function keepServerActive() {
  nodeCron.schedule("*/10 * * * *", async function logUpdateToServer() {
    console.log("Scheduling a new log update.");
    try {
      await axios.post("https://activeserver.onrender.com/log");
      // await axios.post("http://localhost:5000/log");
      console.log("Log update sent.");
    } catch (error) {
      console.log("Error during log update.");
      if (error.response) {
        console.log("The request was made and the server responded with a status code not in the 2xx range.");
        console.log("Error data: ", error.response.data);
        console.log("Error status: ", error.response.status);
        console.log("Error headers: ", error.response.headers);
      } else if (error.request) {
        console.log("The request was made but no response was received.");
        console.log("Request: ", error.request);
      } else {
        console.log("Something happened in setting up the request that triggered an Error.");
        console.log("Error message: ", error.message);
      }
    }
  });
}

module.exports = keepServerActive;

// const axios = require("axios");
// const schedule = require("node-schedule");
// const nodeCron = require("node-cron");

// function keepServerActive() {
//   nodeCron.schedule("*/10 * * * *", function logUpdateToServer() {
//     try {
//       axios.post("https://activeserver.onrender.com/log");
//     } catch (error) {
//       if (error.response) {
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         console.log(error.request);
//       } else {
//         console.log("Error", error.message);
//       }
//     }
//   });
// }

// module.exports = keepServerActive;