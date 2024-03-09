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

module.exports = router;
