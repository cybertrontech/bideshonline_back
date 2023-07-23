import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { isContentCreator } from "../middleware/content.mjs";
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
// import { createTabsController,activateDeactivateTabController,getTabsController } from "../admincontrollers/tabs.controller.mjs"
import {
  getLanguageWiseTabsController,
  createLanguageWiseTabsController,
  deleteLanguageWiseTabsController,
  updateLanguageWiseTabsController,
} from "../admincontrollers/languagewisetabname.controller.mjs";
import { upload } from "../adminutils/image.upload.mjs";
const router = express.Router();

//get all tabs
router.get("/:tabId", [auth, isAdmin], getLanguageWiseTabsController);

//create new language wise tab name
router.post("/:tabId", [auth, isAdmin], createLanguageWiseTabsController);

//update  language wise tab name
router.put(
  "/:langTabNameId",
  [auth, isAdmin],
  updateLanguageWiseTabsController
);

//delete  language wise tab name
router.delete(
  "/:langTabNameId",
  [auth, isAdmin],
  deleteLanguageWiseTabsController
);

// router.get('/',[auth,isAdmin],getTabsController);

// create tabs
// router.post('/',[auth,isAdmin,upload.single("tab-image")],createTabsController);

// // update tabs status
// router.get('/activate/:tabId',[auth,isAdmin],activateDeactivateTabController);

export default router;
