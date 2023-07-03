import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()
import { CustomError } from "../../error/CustomError.mjs";
import { User } from "../models/User.mjs"
const router=express.Router();

  
// Login a new user
router.post('/',async(req,res,next)=>{
    try{
        const {email,password}=req.body;

        const user = await User.findOne({ email });

        if (!user) {
        //   return res.status(401).json({ message: 'Invalid email or password' });
        return next(new CustomError(401,"Invalid email or password"))
        }
    
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
        return next(new CustomError(401,"Invalid email or password"))
        }
    
        // Create and sign a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY);
    
        // Return the token to the client
        return res.json({ token });
    }
    catch(e){
        return next(new CustomError(500,"Something Went Wrong!"))
    }
} );
  


  export default router