import mongoose from "mongoose";

// Define the country schema

const contentCreatorcountrySchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    active: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

// Create the User model
const Contentcreatorcountry = mongoose.model(
  "Contentcreatorcountry",
  contentCreatorcountrySchema
);

export { Contentcreatorcountry };
