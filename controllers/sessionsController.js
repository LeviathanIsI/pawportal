const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");
const Guest = require("../models/Guest");
const Employee = require("../models/Employee");

router.get("/login", (req, res) => {
  res.render("sessions/login.ejs", {
    currentUser: req.session.currentUser || null,
  });
});

router.delete("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

router.post("/", async (req, res) => {
  try {
    const foundUser = await User.findOne({ userName: req.body.username });
    if (!foundUser) {
      return res.send('<a href="/">Sorry, no user found </a>');
    } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      req.session.currentUser = foundUser;
      switch (foundUser.kind) {
        case "Guest":
          res.redirect("/guest/home");
          break;
        case "Employee":
          res.redirect("/employee/home");
          break;
      }
    } else {
      return res.send('<a href="/"> password does not match </a>');
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
