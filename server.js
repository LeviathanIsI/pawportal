// Required modules
require("dotenv").config();
const path = require("path");
const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const PORT = process.env.PORT || 3000;

// Require db connection and models
const db = require("./models");

const guestCtrl = require("./controllers/guestController");
const userCtrl = require("./controllers/userController");

// Create express app
const app = express();

// Set up livereload
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Configure app
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static("public"));
app.use(connectLivereload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
