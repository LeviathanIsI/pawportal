const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkEmployee = require("./isUser");

// Function to generate a random employee ID
const generateEmployeeID = () => Math.floor(Math.random() * 1000);

// Function to check if the employee ID is unique
const isUniqueEmployeeID = async (employeeID) => {
  const employee = await db.Employee.findOne({ employeeID: employeeID });
  return !employee;
};

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
// Being handled in server.js
router.get("/employee/home", isAuthenticated, checkEmployee, (req, res) => {
  res.render("users/employee/homeEmployee.ejs", {
    currentUser: req.session.currentUser,
  });
});

// New Route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs", { currentUser: req.session.currentUser });
});

// Delete Route

// Update Route

// Create Route
router.post("/", async (req, res) => {
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
    res.redirect("/users/employee/home");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating user. Please try again.");
  }
});

// Edit Route

// Show Route

module.exports = router;
