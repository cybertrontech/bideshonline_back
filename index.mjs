import express from "express";
import dotenv from "dotenv";
import connectDb from "./database.js";
import {auth} from "./middleware/auth.mjs";
import userRouter from "./routes/user.routes.js"
import loginRouter from "./routes/login.routes.js"
import languageRouter from "./adminroutes/language.routes.js"
import contentRouter from "./adminroutes/content.routes.js"
import languageWiseTabRouter from "./adminroutes/languagewisetabname.routes.js"
import contentContentRouter from "./contentroutes/content.routes.js"
import imageRouter from "./adminroutes/image.routes.js"
import countryRouter from "./routes/country.routes.js"
import journeyRouter from "./adminroutes/journeycountry.routes.js"
import dataRouter from "./adminroutes/data.routes.js"
import tabsRouter from "./adminroutes/tabs.routes.js"
import tabsFrontRouter from "./routes/tab.routes.js";
import faqsRouter from "./adminroutes/faqs.routes.js";
import tabsRouterContent from "./contentroutes/tabs.routes.js"
import notificationRouter from "./routes/notification.routes.js"
import { CustomError } from "./error/CustomError.mjs";
import { errorHandler } from "./error/handler.mjs";
import cors from "cors"

dotenv.config();
const app=express();
connectDb();
app.use(cors())
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

app.use('/uploads', express.static('uploads'));
app.use('/faqs', faqsRouter);
app.use("/tabs",tabsFrontRouter);
app.use("/admin/journey",journeyRouter);
app.use("/admin/stats",dataRouter);
app.use("/admin/tabs",tabsRouter);
app.use("/content/tabs",tabsRouterContent);
app.use("/content/content",contentContentRouter);
app.use("/admin/content",contentRouter);
app.use("/admin/languagewisetab",languageWiseTabRouter);
app.use("/login",loginRouter);
app.use("/admin/language",languageRouter);
app.use("/admin/image",imageRouter);
app.use("/user",userRouter);
app.use("/country",countryRouter);
app.use("/notification",notificationRouter);
app.use(errorHandler)


const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}.`)
})