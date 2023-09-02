import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { GoogleAuth } from "google-auth-library";
dotenv.config();
import { User } from "../models/User.mjs";
import { CustomError } from "../error/CustomError.mjs";
const router = express.Router();

// Login a new user
router.post("/", async (req, res, next) => {
  try {
    const { email, password, deviceId } = req.body;

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
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
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
      user.deviceId = deviceId;
      await user.save();
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

// Login a new user
router.post("/google", async (req, res, next) => {
  try {
    const { authToken, deviceId } = req.body;

    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`
      )
      .then(async (response) => {
        const { email } = response.data;
        console.log(email);

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
          return next(new CustomError(401, "Invalid email or password"));
        }

        // Compare the provided password with the stored hashed password
        const password = `${process.env.PRIVATE_KEY}${email}`;
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = true;

        if (!isMatch) {
          return next(new CustomError(401, "Invalid email or password"));
        }
        // return res.send(response.data);
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
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
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
          const token = jwt.sign(
            { userId: user._id },
            process.env.PRIVATE_KEY,
            {
              expiresIn: 60 * 60 * 24 * 30,
            }
          );
          user.deviceId = deviceId;
          await user.save();
          return res.json({
            token,
            userType: "normal",
            userId: user._id,
            language: user.language,
            origin: user.origin,
            image: user.image,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return next(new CustomError(500, "Something Went Wrong!"));
      });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

export default router;
