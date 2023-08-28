import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { createContentController, getContentByIdController,deleteContentController,deleteContentCreatorCountriesByIdController,createContentCreatorCountriesByIdController,getContentCreatorCountriesByIdController, getContentController,updateContentController } from "../admincontrollers/content.controller.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import { upload } from "../adminutils/image.upload.mjs";
const router=express.Router();

//get all tabs
router.get('/:tabId',[auth],getContentController);

//get one tab
router.get('/content/:contentId',[auth,isAdmin],getContentByIdController);


//get content creator countries 
router.get('/content-creator/:userId',[auth,isAdmin],getContentCreatorCountriesByIdController);

//create content creator countries 
router.post('/content-creator/:userId',[auth,isAdmin],createContentCreatorCountriesByIdController);

//delete content creator countries 
router.delete('/content-creator/:contentCountryId',[auth,isAdmin],deleteContentCreatorCountriesByIdController);


// create content tabwise 
router.post('/:tabId',[auth,isAdmin,upload.single("image")],createContentController);


// delete tabs  id
router.delete('/:tabId',[auth,isAdmin],deleteContentController);

//update tabs
router.post('/content/:contentId',[auth,isAdmin,upload.single("image")],updateContentController);



export default router