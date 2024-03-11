const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkEmployee = require("./isUser");
const { Employee } = db;

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
router.get("/home", isAuthenticated, checkEmployee, async (req, res) => {
  const employeeId = req.session.currentUser._id;

  try {
    const employee = await Employee.findById(employeeId).populate("caringFor");
    if (!employee) {
      console.error("Employee not found");
      return res.status(404).send("Employee not found");
    }
    res.render("users/employee/homeEmployee.ejs", {
      currentUser: employee,
      pets: employee.caringFor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching employee data");
  }
});

// Settings Index
router.get("/settings", isAuthenticated, checkEmployee, async (req, res) => {
  const currentUser = await db.Guest.findById(req.session.currentUser._id);
  res.render("users/employee/settingsEmployee.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Database route
router.get("/database", isAuthenticated, checkEmployee, async (req, res) => {
  try {
    const guests = await db.Guest.find({});
    res.render("users/employee/databaseEmployee.ejs", {
      guests: guests,
      currentUser: req.session.currentUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching guest data");
  }
});

// New Route
// Initial user creation handled in server.js

// Delete Route

// Update Route
router.post("/settings", isAuthenticated, checkEmployee, async (req, res) => {
  const { address, city, state, zip } = req.body;
  const employeeId = req.session.currentUser._id;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        address,
        city,
        state,
        zip,
      },
      { new: true }
    );

    // Update session with new employee data
    req.session.currentUser = updatedEmployee.toObject();

    res.redirect("/employee/home"); // Redirect to employee home with updated info
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update employee settings");
  }
});

// Create Route
// Initial user creation handled in server.js

// Edit Route

// Show Route
router.get("/guests/:id", isAuthenticated, checkEmployee, async (req, res) => {
  const guestId = req.params.id;
  try {
    const guest = await db.Guest.findById(req.params.id).populate("pets");
    if (!guest) {
      console.error("Guest not found");
      return res.status(404).send("Guest not found");
    }
    res.render("users/employee/guestprofileEmployee.ejs", {
      guest: guest,
      currentUser: req.session.currentUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching guest data");
  }
});

module.exports = router;
