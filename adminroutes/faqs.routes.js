import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {auth} from "../middleware/auth.mjs"
import { isAdmin } from "../middleware/admin.mjs"
import {getFaqsController} from "../admincontrollers/faqs.controller.mjs";
const router=express.Router();

//get all tabs
router.get('/',[auth],getFaqsController);



export default router