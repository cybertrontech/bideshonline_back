import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
import { createTabsController,getTabsController } from "../admincontrollers/tabs.controller.mjs"
import { upload } from "../adminutils/image.upload.mjs"
import { CustomError } from "../error/CustomError.mjs"
const router=express.Router();



// create tabs 
router.post('/',[auth,isAdmin,upload.single("image")],async(req,res,next)=>{
    try {
        const path = req.file.path;
        // console.log(path)
        return res.send(path);
      } catch (e) {
        return next(new CustomError(500, "Something Went Wrong!"));
      }
});



export default router