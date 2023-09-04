import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { isContentCreator } from "../middleware/content.mjs"
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
import { createTabsController,activateDeactivateTabController,updateTabsController,deleteTabsController,getTabsController } from "../admincontrollers/tabs.controller.mjs"
import { upload } from "../adminutils/image.upload.mjs"
const router=express.Router();

//get all tabs
router.get('/',[auth,isAdmin],getTabsController);

router.get('/',[auth,isAdmin],getTabsController);

// create tabs 
router.post('/',[auth,isAdmin,upload.single("tab-image")],createTabsController);

// update tabs status
router.get('/activate/:tabId',[auth,isAdmin],activateDeactivateTabController);

//update tabs
router.put('/:tabId',[auth,isAdmin,upload.single("tab-image")],updateTabsController);



//delete tabs
router.delete('/:tabId',[auth,isAdmin],deleteTabsController);

export default router