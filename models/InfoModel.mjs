import mongoose from "mongoose";

// Define the country schema
const infoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },


    full_address: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default:"",
    },
    email: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the User model
const Info = mongoose.model("Infoj", infoSchema);

export { Info };
