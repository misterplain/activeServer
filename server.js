require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//middleware
const keepServerActive = require("./middleware/keepServerActive");
const scheduledAPICall = require("./middleware/HPNotePad/scheduledAPICall");
const { logger } = require("./middleware/logger");
const { logEvents } = require("./middleware/logger");
//config
const connectDB = require("./config/connectDB");
//notepad routes
const contactRoute = require("./routes/HPNotePad/contactRoute");
const logRoute = require("./routes/HPNotePad/logRoute");
const dataRoute = require("./routes/HPNotePad/dataRoute");
//bcnMinmalista routes
const usersRoutes = require("./routes/bcnMinimalista/usersRoutes");
const authRoutes = require("./routes/bcnMinimalista/authRoutes");
const registerRoutes = require("./routes/bcnMinimalista/registerRoutes");
const refreshRoutes = require("./routes/bcnMinimalista/refreshRoutes");
const logoutRoutes = require("./routes/bcnMinimalista/logoutRoutes");
const blogsRoutes = require("./routes/bcnMinimalista/blogsRoutes");
const collabRoutes = require("./routes/bcnMinimalista/collabRoutes");
const favoritesRoutes = require("./routes/bcnMinimalista/favoritesRoutes");
const commentsRoutes = require("./routes/bcnMinimalista/commentsRoutes");

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
app.use("/bcnmin/register", registerRoutes);
app.use("/bcnmin/refresh", refreshRoutes);
app.use("/bcnmin/logout", logoutRoutes);
app.use("/bcnmin/blogs", blogsRoutes);
app.use("/bcnmin/collab", collabRoutes)
app.use("/bcnmin/favorites", favoritesRoutes);
app.use("/bcnmin/comments", commentsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
