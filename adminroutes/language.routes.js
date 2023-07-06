import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
import { getLanguageController,createLanguageController } from "../admincontrollers/language.controller.mjs"
const router=express.Router();


//get all language
router.get("/",[auth],getLanguageController);
// //get all tabs

// // create tabs 
router.post('/',[auth,isAdmin],createLanguageController);



export default router