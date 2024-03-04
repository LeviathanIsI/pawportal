const mongoose = require("mongoose");
const { Schema } = mongoose;
const options = { discriminatorKey: "kind" };

const UserSchema = new mongoose.Schema(
  {
    userName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    profile: { type: Schema.Types.ObjectId, refPath: "role" },
  },
  options
);

module.exports = mongoose.model("User", UserSchema);
