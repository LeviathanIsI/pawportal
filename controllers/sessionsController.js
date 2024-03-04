const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");
const Guest = require("../models/Guest");
const Employee = require("../models/Employee");

router.get("/login", (req, res) => {
  res.render("sessions/login.ejs");
});

module.exports = router;
