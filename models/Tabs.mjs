import mongoose from "mongoose";

// Define the country schema
const tabsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the User model
const Tabs = mongoose.model("Tabs", tabsSchema);

export  {Tabs};
