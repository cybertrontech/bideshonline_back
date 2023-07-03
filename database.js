import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose"
dotenv.config();
const mongodbUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase"; // Replace with your MongoDB connection URL
const connectDb = () => {
  mongoose
    .connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

export default connectDb;