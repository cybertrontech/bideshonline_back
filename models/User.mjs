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
    verified:{
      type:Boolean,
      default:false
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
    deviceId: {
        type: String
      },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export  {User};
