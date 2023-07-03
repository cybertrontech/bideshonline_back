import express from "express";
import dotenv from "dotenv";
import connectDb from "./database.js";
import {errorHandler} from "../error/handler.mjs";
import {CustomError} from "../error/CustomError.mjs"
import auth from "./middleware/auth.js";
import userRouter from "./routes/user.routes.js"
import loginRouter from "./routes/login.routes.js"

dotenv.config();
const app=express();

connectDb();

app.use(express.json());

app.get("/",auth,(req,res,next)=>{
    try {
        // Some code that may throw an error
        throw new CustomError(400, 'Bad Request');
      } catch (err) {
        // Pass the error to the error handler
        next(err);
      }
})

app.use("/login",loginRouter)
app.use("/user",userRouter)
app.use(errorHandler)


const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}.`)
})