import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()
import { getAllCountryController } from "../controllers/country.controller.mjs"
import {auth} from "../middleware/auth.mjs"
const router=express.Router();

  
// get all countries list 
router.get('/',auth,getAllCountryController);

// get all countries list 
// router.get('/',auth,getAllCountryController);

export default router