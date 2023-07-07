import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
import { getLanguageController,getLanguageControllerId,createLanguageController } from "../admincontrollers/language.controller.mjs"
const router=express.Router();


//get all language
router.get("/",[auth],getLanguageController);

//get all language byId
router.get("/:countryId",[auth],getLanguageControllerId);

// // create tabs 
router.post('/',[auth,isAdmin],createLanguageController);



export default router