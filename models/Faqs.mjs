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
      default:"",
    },
    journey:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journery"
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
