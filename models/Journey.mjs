import mongoose from "mongoose";

// Define the journey schema
const journeySchema = new mongoose.Schema(
  {
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
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
const Journery = mongoose.model("Journery", journeySchema);

export { Journery };
