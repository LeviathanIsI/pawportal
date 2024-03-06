const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route


// New Route
router.get("/pet/add", isAuthenticated, checkEmployee, (req, res) => {
  res.render("users/guest/petsGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Delete Route

// Update Route

// Create Route
router.get("/pet/add", isAuthenticated, checkEmployee, (req, res) => {
  res.render("users/guest/petsGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Edit Route

// Show Route

module.exports = router;
