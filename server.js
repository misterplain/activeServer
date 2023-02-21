require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const keepServerActive = require("./middleware/keepServerActive");
const scheduledAPICall = require("./middleware/HPNotePad/scheduledAPICall");
const connectDB = require("./config/connectDB");
const contactRoute = require("./route/HPNotePad/contactRoute");
const logRoute = require("./route/HPNotePad/logRoute");
const dataRoute = require("./route/HPNotePad/dataRoute");

const app = express();

//Connect to Mongo DB
connectDB();

app.use("/", express.static(path.resolve(path.join(__dirname, "./build"))));

app.use(express.json());
app.use(cors());

app.use("/notepad/contact", contactRoute);
app.use("/notepad/log", logRoute);
app.use("/notepad/data", dataRoute);

keepServerActive();
scheduledAPICall();

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
