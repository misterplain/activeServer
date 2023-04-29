const axios = require("axios");
const schedule = require("node-schedule");
const nodeCron = require("node-cron");
const connectDB = require("../../config/connectDB");


//7.30 api call will actually call this at 9.30am Barcelona time 
//6 am api call will actually call this at 8am Barcelona time
function scheduledAPICall() {
  nodeCron.schedule("0" 6 * * * ", function logUpdateToServer() {
    try {
      axios.post("https://activeserver.onrender.com/notepad/data");
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log("error within scheduledAPICall");
    }
  });
}

//testing
// function scheduledAPICall() {
//   nodeCron.schedule("30 7 * * *", function logUpdateToServer() {
//     try {
//       axios.post("http://localhost:5000/notepad/data");
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
//       console.log("error within scheduledAPICall");
//     }
//   });
// }


module.exports = scheduledAPICall;
