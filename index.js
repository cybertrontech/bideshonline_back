import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app=express();


app.get("/",(req,res)=>{
    return res.send("Hello World")
})


const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}.`)
})