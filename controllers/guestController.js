const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const isAuthenticated = require("./isAuthenticated");
const checkGuest = require("./isGuest");
const { Guest } = db;

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

// Index Route
router.get("/home", isAuthenticated, checkGuest, (req, res) => {
  res.render("users/guest/homeGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Settings Index
router.get("/settings", isAuthenticated, checkGuest, async (req, res) => {
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
router.get("/home/add", isAuthenticated, checkGuest, (req, res) => {
  res.render("users/guest/addpetGuest.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Delete Route
router.delete("/pets/:petId", isAuthenticated, checkGuest, async (req, res) => {
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
    req.session.currentUser = updatedGuest;

    res
      .status(200)
      .json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).redirect("/guest/home");
  }
});

// Update Route
router.post("/settings", isAuthenticated, checkGuest, async (req, res) => {
  const { address, city, state, zip } = req.body;
  const userId = req.session.currentUser._id;

  try {
    const updatedGuest = await Guest.findByIdAndUpdate(
      userId,
      {
        address,
        city,
        state,
        zip,
      },
      { new: true } // Note to self: { new: true } is necessary to return the updated document to display on page without needing to refresh
    );

    // Update the session information
    req.session.currentUser = {
      ...req.session.currentUser,
      address,
      city,
      state,
      zip,
    };

    // Respond with the updated address information
    res.json({
      success: true,
      address: updatedGuest.address,
      city: updatedGuest.city,
      state: updatedGuest.state,
      zip: updatedGuest.zip,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Create Route
// Initial user creation handled in server.js

// Create route for adding a pet
router.post("/pets/add", isAuthenticated, checkGuest, async (req, res) => {
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

    res.redirect("/guest/home");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating pet. Please try again.");
  }
});

// Edit Route
router.get("/settings", isAuthenticated, checkGuest, (req, res) => {
  res.render("users/guest/settingsGuest.ejs", {
    currentUser: req.session.currentUser,
    pets: req.session.currentUser.pets,
  });
});

// Show Route
router.get("/pets/:petId", isAuthenticated, checkGuest, async (req, res) => {
  const { petId } = req.params;
  const pet = await db.Pet.findById(petId);
  res.render("users/guest/petGuestShow.ejs", {
    currentUser: req.session.currentUser,
    pet: pet,
  });
});

module.exports = router;
