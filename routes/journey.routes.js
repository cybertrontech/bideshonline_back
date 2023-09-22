import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { CustomError } from "../error/CustomError.mjs";
import { Journery } from "../models/Journey.mjs";
const router = express.Router();

// get all countries list
router.get("/", [auth], async (req, res, next) => {
  try {
    const journey = await Journery.find({})
      .populate({ path: "origin destination", select: "_id name" })
      .select("-__v -active");
    return res.send(journey);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

export default router;
