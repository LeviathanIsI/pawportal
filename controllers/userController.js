const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkEmployee = require("./isUser");
const mongoose = require("mongoose");
const { Employee } = db;
const { Note } = db;
const { Pet } = db;

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route - Displays the employee's dashboard
router.get("/home", isAuthenticated, checkEmployee, async (req, res) => {
  const currentUser = req.session.currentUser._id;

  try {
    const employee = await Employee.findById(currentUser).populate("caringFor");
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

// Settings Index - Will take the employee to their settings page
router.get("/settings", isAuthenticated, checkEmployee, async (req, res) => {
  const currentUser = await db.Guest.findById(req.session.currentUser._id);
  res.render("users/employee/settingsEmployee.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Database route - Will take the employee to the database of all guests
router.get("/database", isAuthenticated, checkEmployee, async (req, res) => {
  try {
    const guests = await db.Guest.find({}).populate("pets");
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

// Update Pet Information
router.post(
  "/pets/:id/update",
  isAuthenticated,
  checkEmployee,
  async (req, res) => {
    const {
      name,
      age,
      weight,
      medications,
      specialNeeds,
      feedingInstructions,
      behavior,
      lastVetVisit,
      nextVetVisit,
      noteContent,
    } = req.body;
    try {
      await db.Pet.findByIdAndUpdate(req.params.id, {
        name,
        age,
        weight,
        medications,
        specialNeeds,
        feedingInstructions,
        behavior,
        lastVetVisit,
        nextVetVisit,
      });

      res.redirect(`/employee/pets/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to update pet");
    }
  }
);

// Add pet to employee's care
router.post(
  "/pets/:id/add",
  isAuthenticated,
  checkEmployee,
  async (req, res) => {
    try {
      const employee = await db.Employee.findById(req.session.currentUser._id);
      const petId = req.params.id;

      // Check if the pet is already under the employee's care
      const isAlreadyCaringForPet = employee.caringFor.some(
        (pet) => pet.toString() === petId
      );

      if (!isAlreadyCaringForPet) {
        // If not, add the pet to the employee's care
        employee.caringFor.push(petId);
        await employee.save();
        res.redirect("/employee/home");
      } else {
        res.redirect("/employee/home");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to add pet to employee's care");
    }
  }
);

//Remove pet from employee's care
router.post(
  "/pets/:id/remove",
  isAuthenticated,
  checkEmployee,
  async (req, res) => {
    try {
      const employee = await db.Employee.findById(req.session.currentUser._id);
      const pet = await db.Pet.findById(req.params.id);
      employee.caringFor.pull(pet);
      await employee.save();
      res.redirect("/employee/home");
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to remove pet from employee's care");
    }
  }
);

// Create Route
// Initial user creation handled in server.js

// Edit Route
router.get(
  "/pets/:id/edit",
  isAuthenticated,
  checkEmployee,
  async (req, res) => {
    const petId = req.params.id;
    try {
      const pet = await db.Pet.findById(petId);
      if (!pet) {
        console.error("Pet not found");
        return res.status(404).send("Pet not found");
      }

      res.render("users/employee/editPetEmployee.ejs", {
        pet: pet,
        currentUser: req.session.currentUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching pet data");
    }
  }
);

// Show Route

// Show Guest Profile
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

// Show Pet Profile
router.get("/pets/:id", isAuthenticated, checkEmployee, async (req, res) => {
  const petId = req.params.id;
  try {
    const pet = await db.Pet.findById(req.params.id).populate("owner");
    if (!pet) {
      console.error("Pet not found");
      return res.status(404).send("Pet not found");
    }
    res.render("users/employee/petprofileEmployee.ejs", {
      pet: pet,
      currentUser: req.session.currentUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching pet data");
  }
});

module.exports = router;
