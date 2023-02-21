const axios = require("axios");
const schedule = require("node-schedule");
const nodeCron = require("node-cron");

function scheduledAPICall(){
    nodeCron.schedule("0 7 * * * ", function logUpdateToServer() {
        // Do whatever you want in here. Send email, Make  database backup or download data.
        try {
            axios.post(
                "https://hpnotepad-test-api.onrender.com/data"
            );
        //   console.log("res", res);
        } catch (error) {
            console.log(error.message);
        }
    });
}

//testing

// function scheduledAPICall(){
//     nodeCron.schedule("*/2 * * * * ", function logUpdateToServer() {
//         // Do whatever you want in here. Send email, Make  database backup or download data.
//         try {
//             // axios.post(
//             //     "https://hpnotepad-test-api.onrender.com/data"
//             // );
//             axios.post(
//                 "http://localhost:5000/data"
//             );
//         //   console.log("res", res);
//         } catch (error) {
//             console.log(error.message);
//         }
//     });
// }



module.exports = scheduledAPICall;