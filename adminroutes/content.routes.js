import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { createContentController, getContentByIdController, getContentController,updateContentController } from "../admincontrollers/content.controller.mjs";
import { isAdmin } from "../middleware/admin.mjs";
const router=express.Router();

//get all tabs
router.get('/:tabId',[auth],getContentController);

//get one tab
router.get('/content/:contentId',[auth,isAdmin],getContentByIdController);

// create tabs 
router.post('/:tabId',[auth,isAdmin],createContentController);

//update tabs
router.post('/content/:contentId',[auth,isAdmin],updateContentController);



export default router