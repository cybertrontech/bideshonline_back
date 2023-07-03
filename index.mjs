import express from "express";
import dotenv from "dotenv";
import connectDb from "./database.js";
import {errorHandler} from "../error/handler.mjs";
import {CustomError} from "../error/CustomError.mjs"
import auth from "./middleware/auth.js";

dotenv.config();
const app=express();

connectDb();

app.get("/",auth,(req,res,next)=>{
    try {
        // Some code that may throw an error
        throw new CustomError(400, 'Bad Request');
      } catch (err) {
        // Pass the error to the error handler
        next(err);
      }
})


app.use(errorHandler)


const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}.`)
})