// Required modules
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 3000;

// Require db connection and models
const db = require("./models");

// Function to generate a random employee ID
const generateEmployeeID = () => Math.floor(Math.random() * 1000);

// Function to check if the employee ID is unique
const isUniqueEmployeeID = async (employeeID) => {
  const employee = await db.Employee.findOne({ employeeID: employeeID });
  return !employee;
};

const guestCtrl = require("./controllers/guestController");
const userCtrl = require("./controllers/userController");
const sessionCtrl = require("./controllers/sessionsController");
const petCtrl = require("./controllers/petController");

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
    store: MongoStore.create({ mongoUrl: process.env.MONGODBURI }),
    cookie: { maxAge: 86400000 },
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/guest", guestCtrl);
app.use("/employee", userCtrl);
app.use("/sessions", sessionCtrl);
app.use("/pet", petCtrl);

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
app.get("/", (req, res) => {
  res.render("home.ejs", {
    currentUser: req.session.currentUser || null,
  });
});

// New Route
app.get("/signup", (req, res) => {
  if (!req.session.currentUser)
    res.render("users/signup.ejs", { currentUser: req.session.currentUser });
  else {
    if (req.session.currentUser.kind === "Guest") {
      res.redirect("/guest/home");
    } else {
      res.redirect("/employee/home");
    }
  }
});

// Delete Route

// Update Route

// Create Route
app.post("/", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    if (req.body.kind === "Employee") {
      let employeeID = generateEmployeeID();
      let unique = await isUniqueEmployeeID(employeeID);

      while (!unique) {
        employeeID = generateEmployeeID();
        unique = await isUniqueEmployeeID(employeeID);
      }
      req.body.employeeID = employeeID;
    }
    const newUser = await db.User.create(req.body);
    req.session.currentUser = newUser;
    if (newUser.kind === "Employee") {
      return res.redirect("/employee/home");
    } else {
      return res.redirect("/guest/home");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating user. Please try again.");
  }
});

// Edit Route

// Show Route
app.get("/pricing", (req, res) => {
  res.render("./users/pricing.ejs", { currentUser: req.session.currentUser });
});

// Catch-all
app.get("*", function (req, res) {
  res.send("Invalid path");
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
