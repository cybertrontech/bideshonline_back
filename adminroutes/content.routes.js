import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { createContentController, getContentController } from "../admincontrollers/content.controller.mjs";
import { isAdmin } from "../middleware/admin.mjs";
const router=express.Router();

//get all tabs
router.get('/:tabId',[auth],getContentController);

// create tabs 
router.post('/:tabId',[auth,isAdmin],createContentController);



export default router