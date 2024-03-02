const mongoose = require("mongoose");
const { Schema } = mongoose;
const options = { discriminatorKey: "kind" };

const UserSchema = new mongoose.Schema({
    userName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, refPath: "role" },
    firstName: String,
    lastName: String,
  },
  options
);

module.exports = mongoose.model("User", UserSchema);
