const mongoose = require("mongoose");
const User = require("./User");
const { Schema } = mongoose;
const options = { discriminatorKey: "kind" };

const GuestSchema = User.discriminator(
  "Guest",
  new mongoose.Schema(
    {
      phoneNumber: String,
      address: String,
      pets: [
        {
          type: Schema.Types.ObjectId,
          ref: "Pet",
        },
      ],
    },
    options
  )
);

module.exports = GuestSchema;