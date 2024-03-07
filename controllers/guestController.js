const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkEmployee = require("./isUser");
const { Guest } = db;
const { Pet } = db;

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
router.get("/home", isAuthenticated, (req, res) => {
  res.render("users/guest/homeGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Settings Index
router.get("/settings", isAuthenticated, async (req, res) => {
  const currentUser = await db.Guest.findById(
    req.session.currentUser._id
  ).populate("pets");
  res.render("users/guest/settingsGuest.ejs", {
    currentUser: currentUser.toObject(),
  });
});

// New Route
// Initial user creation handled in server.js

// New Route for adding a pet
router.get("/pets/add", isAuthenticated, (req, res) => {
  res.render("users/guest/addpetGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Delete Route
router.delete("/pets/:petId", isAuthenticated, async (req, res) => {
  const { petId } = req.params;
  try {
    // Remove the pet from the Pets collection
    await db.Pet.findOneAndDelete({ _id: petId });

    // Pull the pet from the currentUser's pets array
    await db.Guest.findByIdAndUpdate(req.session.currentUser._id, {
      $pull: { pets: petId },
    });

    const updatedGuest = await db.Guest.findById(
      req.session.currentUser._id
    ).populate("pets");
    req.session.currrentUser = updatedGuest;

    res
      .status(200)
      .json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).redirect("/guest/home");
  }
});

// Update Route
router.post("/settings", isAuthenticated, async (req, res) => {
  const { address } = req.body;
  const userId = req.session.currentUser._id;

  try {
    await Guest.findByIdAndUpdate(userId, { address: address });
    res.json({ success: true, message: "Address updated successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Create Route
// Initial user creation handled in server.js

// Create route for adding a pet
router.post("/pets/add", isAuthenticated, async (req, res) => {
  const { name, species, breed, age, weight } = req.body;
  try {
    const newPet = await db.Pet.create({
      name,
      species,
      breed,
      age,
      weight,
    });

    const updatedGuest = await db.Guest.findByIdAndUpdate(
      req.session.currentUser._id,
      { $push: { pets: newPet._id } },
      { new: true }
    ).populate("pets");

    req.session.currentUser = updatedGuest;

    res.redirect("/guest/settings");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating pet. Please try again.");
  }
});

// Create route for adding a pet
router.post("/pets/add", isAuthenticated, async (req, res) => {
  const { name, species, breed, age, weight } = req.body;
  try {
    const newPet = await db.Pet.create({
      name,
      species,
      breed,
      age,
      weight,
    });

    const updatedGuest = await db.Guest.findByIdAndUpdate(
      req.session.currentUser._id,
      { $push: { pets: newPet._id } },
      { new: true }
    ).populate("pets");

    req.session.currentUser = updatedGuest;

    res.redirect("/settings");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating pet. Please try again.");
  }
});

// Edit Route
router.get("/settings", isAuthenticated, (req, res) => {
  res.render("users/guest/settingsGuest.ejs", {
    currentUser: req.session.currentUser,
    pets: req.session.currentUser.pets,
  });
});

// Show Route

module.exports = router;
