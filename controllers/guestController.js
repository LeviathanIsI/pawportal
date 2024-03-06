const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkEmployee = require("./isUser");
const { Guest } = db;

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
router.get("/home", isAuthenticated, (req, res) => {
  res.render("users/guest/homeGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// New Route
// Initial user creation handled in server.js

// Delete Route

// Update Route
router.post("/settings", isAuthenticated, async (req, res) => {
  console.log(req.body);
  const { address } = req.body;
  const userId = req.session.currentUser._id;

  try {
    await Guest.findByIdAndUpdate(userId, { address: address });
  } catch (error) {
    console.log(error);
  }
});

// Create Route
// Initial user creation handled in server.js

// Edit Route
router.get("/settings", isAuthenticated, (req, res) => {
  res.render("users/guest/settingsGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Show Route

module.exports = router;
