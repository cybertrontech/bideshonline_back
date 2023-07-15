import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/User.mjs";
import { CustomError } from "../error/CustomError.mjs";
const router = express.Router();

// Login a new user
router.post("/", async (req, res, next) => {
  // try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new CustomError(401, "Invalid email or password"));
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new CustomError(401, "Invalid email or password"));
    }
    // Create and sign a JWT token
    if (user.userType === "admin") {
      const token = jwt.sign(
        { userId: user._id, isAdmin: true },
        process.env.PRIVATE_KEY
      );
      // Return the token to the client
      return res.json({ token,userType:"admin"  });
    } else if (user.userType === "content") {
      const token = jwt.sign(
        { userId: user._id, isContentCreator: true },
        process.env.PRIVATE_KEY
      );
      // Return the token to the client
      return res.json({ token,userType:"content" });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY);
      return res.json({ token,userType:"normal" });
    }
  // } catch (e) {
  //   return next(new CustomError(500, "Something Went Wrong!"));
  // }
});

export default router;
