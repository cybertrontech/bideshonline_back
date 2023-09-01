import mongoose from "mongoose";

// Define the country schema

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      // required:true,
      ref: "Content",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // required:true,
      ref: "User",
    },

    seen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["push", "normal"],
      default: "normal",
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create the User model
const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
