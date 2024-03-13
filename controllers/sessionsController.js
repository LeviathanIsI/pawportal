const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");
const Guest = require("../models/Guest");

// New session route
router.get("/login", (req, res) => {
  res.render("sessions/login.ejs", {
    currentUser: req.session.currentUser || null,
  });
});

// Logout/Destroy session route
router.delete("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Login/Create session route
router.post("/", async (req, res) => {
  try {
    // Find the user by username
    const foundUser = await User.findOne({ userName: req.body.username });
    // If the user is not found, send a message
    if (!foundUser) {
      return res.send('<a href="/">Sorry, no user found </a>');
      // If the user is found, compare the password
    } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      // If the password matches and the user is a guest, populate the pets and set the session for a guest
      if (foundUser.kind === "Guest") {
        const guestWithPets = await Guest.findById(foundUser._id).populate(
          "pets"
        );
        req.session.currentUser = guestWithPets.toObject();
        // If the user is not a guest, set the session for an employee
      } else {
        req.session.currentUser = foundUser.toObject();
      }

      // Redirect the user based on their kind
      switch (foundUser.kind) {
        case "Guest":
          res.redirect("/guest/home");
          break;
        case "Employee":
          res.redirect("/employee/home");
          break;
      }
    }
    // If the password does not match, send a message
    else {
      return res.send('<a href="/"> password does not match </a>');
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
