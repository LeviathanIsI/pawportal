require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => console.log(`Connected to MongoDB at ${db.host}:${db.port}`))
  .catch((err) => console.log(err));

const db = mongoose.connection;

module.exports = {
  User: require("./User"),
  Guest: require("./Guest"),
  Employee: require("./Employee"),
  Pet: require("./Pet"),
  Note: require("./Note"),
};
