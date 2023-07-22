import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regular expression for email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["admin", "content", "normal"],
      default: "normal",
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    image: {
      type: String,
      default: "",
    },
    deviceId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const destinationUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  { timestamps: true }
);
// Create the User model
const User = mongoose.model("User", userSchema);

const DestinationUser = mongoose.model(
  "DestinationUser",
  destinationUserSchema
);

export { User, DestinationUser };
