import mongoose from "mongoose";

// Define the country schema

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Country"
    },

  },
  { timestamps: true }
);

languageSchema.index({ name: 1, country: 1 }, { unique: true });

// Create the User model
const Language = mongoose.model("Language", languageSchema);

export  {Language};
