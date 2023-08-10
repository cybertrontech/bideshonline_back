import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllCountryController,
  getLanguageByCountryController,
  getDestinationCountryController,getDestinationCountryControllerByUser
} from "../controllers/country.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
const router = express.Router();

// get all countries list
router.get("/", getAllCountryController);

// get language by contry
router.get("/language/:countryId", getLanguageByCountryController);

// get user country destination 
router.get("/destination",[auth], getDestinationCountryController);

// get user country destination  and user
router.get("/user-destination/:userId",[auth], getDestinationCountryControllerByUser);



export default router;
