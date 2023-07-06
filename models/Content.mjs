import mongoose from "mongoose";

// Define the journey schema
const contentSchema = new mongoose.Schema(
  {
    tab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tabs",
      required: true,
    },
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journey",
      required: true,
    },
    data:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

// Create the User model
const Content = mongoose.model("Content", contentSchema);

export { Content };
