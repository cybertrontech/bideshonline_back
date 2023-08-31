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
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, verified: true });

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
        process.env.PRIVATE_KEY,
        {
          expiresIn: 60 * 60 * 24 * 2,
        }
      );
      // Return the token to the client
      return res.json({
        token,
        userType: "admin",
        userId: user._id,
        language: user.language,
        origin: user.origin,
        image: user.image,
        email:user.email,
        name:`${user.first_name} ${user.last_name}`
      });
    } else if (user.userType === "content") {
      const token = jwt.sign(
        { userId: user._id, isContentCreator: true },
        process.env.PRIVATE_KEY,
        {
          expiresIn: 60 * 60 * 24 * 2,
        }
      );
      // Return the token to the client
      return res.json({
        token,
        userType: "content",
        userId: user._id,
        language: user.language,
        origin: user.origin,
        image: user.image,
      });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
        expiresIn: 60 * 60 * 24 * 30,
      });
      return res.json({
        token,
        userType: "normal",
        userId: user._id,
        language: user.language,
        origin: user.origin,
        image: user.image,
      });
    }
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

export default router;
