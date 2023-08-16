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
    const noti = await Notification.find({ user: req.user.userId })
      .populate({ path: "content", select: "_id tab" })
      .select("-user -__v");
    return res.send(noti);
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { contentId } = req.body;
    const noti = new Notification({
      content: contentId,
      user: req.user.userId,
    });
    await noti.save();
    return res.send({ message: "Sucessfully created notification." });
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});
export default router;
