const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs", { currentUser: req.session.currentUser });
});

router.post("/", async (req, res) => {
  console.log("This is the req.body: ", req.body);
  try {
    req.body.password = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    const newUser = await db.User.create(req.body);
    console.log(newUser);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
