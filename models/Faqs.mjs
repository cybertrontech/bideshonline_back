import mongoose from "mongoose";

// Define the country schema
const fqsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    active:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

// Create the User model
const Faqs = mongoose.model("Faqs", fqsSchema);

export  {Faqs};
