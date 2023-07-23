import mongoose from "mongoose";

// Define the country schema
const languageWiseTabNameSchema = new mongoose.Schema(
  {
    language_wise_title: {
      type: String,
      required: true,
      //   unique:true
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Language",
    },
    tab: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tab",
    },
  },
  { timestamps: true }
);


const Languagewisetab = mongoose.model(
  "Languagewisetab",
  languageWiseTabNameSchema
);

export { Languagewisetab };
