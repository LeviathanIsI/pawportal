const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");

// Function to generate a random employee ID
const generateEmployeeID = () => Math.floor(Math.random() * 1000);

// Function to check if the employee ID is unique
const isUniqueEmployeeID = async (employeeID) => {
  const employee = await db.Employee.findOne({ employeeID: employeeID });
  return !employee;
};

console.log(generateEmployeeID);

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs", { currentUser: req.session.currentUser });
});

router.post("/", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    if (req.body.kind === "Employee") {
      let employeeID = generateEmployeeID();
      let unique = await isUniqueEmployeeID(employeeID);

      while (!unique) {
        employeeID = generateEmployeeID();
        unique = await isUniqueEmployeeID(employeeID);
      }
      req.body.employeeID = employeeID;
    }
    console.log("req.body.kind:", req.body.kind);
    const newUser = await db.User.create(req.body);
    console.log(newUser);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating user. Please try again.");
  }
});

module.exports = router;
