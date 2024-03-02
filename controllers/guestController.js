const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

module.exports = router;
