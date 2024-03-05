const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkEmployee = require("./isUser");

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
router.get("/home", isAuthenticated, checkEmployee, (req, res) => {
  res.render("users/employee/homeEmployee.ejs", {
    currentUser: req.session.currentUser,
  });
});

// New Route
// Initial user creation handled in server.js

// Delete Route

// Update Route

// Create Route
// Initial user creation handled in server.js

// Edit Route

// Show Route

module.exports = router;
