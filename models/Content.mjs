import mongoose from "mongoose";

// Define the journey schema
const contentSchema = new mongoose.Schema(
  {
    tab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tabs",
      required: true,
    },
    language:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journery",
      required: true,
    },
    title:{
        type:String,
        default:"",
        required:true
    },
    youtube_video_link:{
        type:String,
        default:"",
    },
    background_image:{
      type:String,
      default:"",
  },

    data:{
        type:String,
        required:true
    },

    active:{
      type:Boolean,
      default:true
    },
    creator:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  
    }
  },
  { timestamps: true }
);

// Create the User model
const Content = mongoose.model("Content", contentSchema);

export { Content };
