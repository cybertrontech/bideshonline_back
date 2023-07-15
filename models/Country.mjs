import mongoose from "mongoose";

// Define the country schema

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    image: {
      type: String,
      required: true,
    },
    active:{
      type:String,
      default:true
    }
  },
  { timestamps: true }
);

// Create the User model
const Country = mongoose.model("Country", countrySchema);

export  {Country};
