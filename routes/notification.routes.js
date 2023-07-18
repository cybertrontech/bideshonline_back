import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { getAllCountryController } from "../controllers/country.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { CustomError } from "../error/CustomError.mjs";
import { Notification } from "../models/Notification.mjs";
const router = express.Router();

// get all countries list
router.get("/", auth, async (req, res, next) => {
  try {
    const noti = await Notification.find({ user: req.user.userId });
    return res.send(noti);
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});

export default router;
