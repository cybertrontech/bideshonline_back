import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
import { createTabsController,getTabsController } from "../admincontrollers/tabs.controller.mjs"
import { upload } from "../adminutils/image.upload.mjs"
const router=express.Router();

//get all tabs
router.get('/',[auth,isAdmin],getTabsController);

// create tabs 
router.post('/',[auth,isAdmin,upload.single("tab-image")],createTabsController);



export default router