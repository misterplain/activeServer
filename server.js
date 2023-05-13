require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//middleware
const keepServerActive = require("./keepServerActive");
const scheduledAPICall = require("./HPNotePad//middleware/scheduledAPICall");
const { logger } = require("./middleware/logger");
const { logEvents } = require("./middleware/logger");
//config
const connectDB = require("./config/connectDB");
//notepad routes
const contactRoute = require("./HPNotePad/routes/contactRoute");
const logRoute = require("./HPNotePad/routes/logRoute");
const dataRoute = require("./HPNotePad/routes/dataRoute");
//bcnMinmalista routes
const usersRoutes = require("./bcnMinimalista/routes/usersRoutes");
const authRoutes = require("./bcnMinimalista/routes/authRoutes");
const refreshRoutes = require("./bcnMinimalista/routes/refreshRoutes");
const logoutRoutes = require("./bcnMinimalista/routes/logoutRoutes");
const blogsRoutes = require("./bcnMinimalista/routes/blogsRoutes");
const collabRoutes = require("./bcnMinimalista/routes/collabRoutes");
const favoritesRoutes = require("./bcnMinimalista/routes/favoritesRoutes");
const commentsRoutes = require("./bcnMinimalista/routes/commentsRoutes");
//porfolio routes
const contactPortfolioRoute = require("./portfolio/routes/contactRoute");
//fantasticfy
const fetchDataRoute = require("./Fantasticfy/routes/fetchDataRoute");
const app = express();

//Connect to Mongo DB
connectDB();

//custom middleware logger
app.use(logger);
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

app.use("/", express.static(path.resolve(path.join(__dirname, "./build"))));

app.use(express.json());
app.use(cors("*"));

//keep server active
keepServerActive();
app.use("/log", logRoute);

//notepad
scheduledAPICall();
app.use("/notepad/contact", contactRoute);
app.use("/notepad/data", dataRoute);

//bcnMinimalista
app.use("/bcnmin/users", usersRoutes);
app.use("/bcnmin/auth", authRoutes);
app.use("/bcnmin/refresh", refreshRoutes);
app.use("/bcnmin/logout", logoutRoutes);
app.use("/bcnmin/blogs", blogsRoutes);
app.use("/bcnmin/collab", collabRoutes);
app.use("/bcnmin/favorites", favoritesRoutes);
app.use("/bcnmin/comments", commentsRoutes);

//portfolio
app.use("/portfolio/contact", contactPortfolioRoute);

//fantasticfy
app.use("/fantasticfy/data", fetchDataRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
