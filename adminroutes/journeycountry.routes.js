import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { createContryController, getAllJourneyController,createJourneyController } from "../admincontrollers/journeycountry.controller.mjs"
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
const router=express.Router();

// get all countries list 
router.get('/',[auth,isAdmin],getAllJourneyController);

//create countries for journey
router.post('/',[auth,isAdmin],createContryController);

//create journies for journey
router.post('/',[auth,isAdmin],createJourneyController);




export default router