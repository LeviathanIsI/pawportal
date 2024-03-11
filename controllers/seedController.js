const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Guest = require("../models/Guest");

router.get("/seed-guests", async (req, res) => {
  const guestSeedData = [];

  for (let i = 1; i <= 30; i++) {
    guestSeedData.push({
      userName: `guest${i}`,
      email: `guest${i}@example.com`,
      password: await bcrypt.hash("guestpassword123", 10), // Hashing the password
      firstName: `Guest`,
      lastName: `${i}`,
      address: `${i} Guest St, Guestville`,
      city: "Guestville",
      state: "GS",
      zip: "12345",
    });
  }

  try {
    // Insert the seed data
    const seededGuests = await Guest.insertMany(guestSeedData);
    res.send("Database seeded successfully with guests data!");
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).send("Error seeding the database.");
  }
});

module.exports = router;
