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
const refreshRoutes = require("./routes/bcnMinimalista/refreshRoutes");
const logoutRoutes = require("./routes/bcnMinimalista/logoutRoutes");
const blogsRoutes = require("./routes/bcnMinimalista/blogsRoutes");
const collabRoutes = require("./routes/bcnMinimalista/collabRoutes");
const favoritesRoutes = require("./routes/bcnMinimalista/favoritesRoutes");
const commentsRoutes = require("./routes/bcnMinimalista/commentsRoutes");
//porfolio routes
const contactPortfolioRoute = require("./routes/portfolio/contactRoute");
//boilerplate
// const authBPRoutes = require("./routes/boilerPlate/authRoutes");
// const blogBPRoutes = require("./routes/boilerPlate/blogsRoutes");
// const collabBPRoutes = require("./routes/boilerPlate/collabRoutes");
// const commentsBPRoutes = require("./routes/boilerPlate/commentsRoutes");
// const favoritesBPRoutes = require("./routes/boilerPlate/favoritesRoutes");
// const logoutBPRoutes = require("./routes/boilerPlate/logoutRoutes");
// const refreshBPRoutes = require("./routes/boilerPlate/refreshRoutes");
// const registerBPRoutes = require("./routes/boilerPlate/registerRoutes");
// const usersBPRoutes = require("./routes/boilerPlate/usersRoutes");

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

//boilerplate
// app.use("/boilerplate/users", usersBPRoutes);
// app.use("/boilerplate/auth", authBPRoutes);
// app.use("/boilerplate/register", registerBPRoutes);
// app.use("/boilerplate/refresh", refreshBPRoutes);
// app.use("/boilerplate/logout", logoutBPRoutes);
// app.use("/boilerplate/blogs", blogBPRoutes);
// app.use("/boilerplate/collab", collabBPRoutes);
// app.use("/boilerplate/favorites", favoritesBPRoutes);
// app.use("/boilerplate/comments", commentsBPRoutes);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server listing to port 5000 only`));
