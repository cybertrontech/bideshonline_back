import express from "express";
import dotenv from "dotenv";
import connectDb from "./database.js";
import { auth } from "./middleware/auth.mjs";
import userRouter from "./routes/user.routes.js";
import loginRouter from "./routes/login.routes.js";
import json2csv from "json2csv";
import languageRouter from "./adminroutes/language.routes.js";
import contentRouter from "./adminroutes/content.routes.js";
import languageWiseTabRouter from "./adminroutes/languagewisetabname.routes.js";
import contentContentRouter from "./contentroutes/content.routes.js";
import imageRouter from "./adminroutes/image.routes.js";
import countryRouter from "./routes/country.routes.js";
import journeyRouter from "./adminroutes/journeycountry.routes.js";
import dataRouter from "./adminroutes/data.routes.js";
import { Info } from "./models/InfoModel.mjs";
import tabsRouter from "./adminroutes/tabs.routes.js";
import infoRouter from "./adminroutes/info.routes.js";
import tabsFrontRouter from "./routes/tab.routes.js";
import faqsRouter from "./adminroutes/faqs.routes.js";
import tabsRouterContent from "./contentroutes/tabs.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { CustomError } from "./error/CustomError.mjs";
import { errorHandler } from "./error/handler.mjs";
import cors from "cors";
import fs from "fs";
import { DestinationUser, User } from "./models/User.mjs";
import { isAdmin } from "./middleware/admin.mjs";
import { Country } from "./models/Country.mjs";

dotenv.config();
const app = express();
connectDb();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", auth, (req, res, next) => {
  try {
    // Some code that may throw an error
    throw new CustomError(400, "Bad Request");
  } catch (err) {
    // Pass the error to the error handler
    next(err);
  }
});

app.get("/origins-stats",[auth,isAdmin], async(req, res, next) => {
  try {
    // const origin=await 
    const user=await User.aggregate([
      {
        $group: {
          _id: '$origin', // Group by the customerId field
          totalUsers: { $sum: 1 }, // Calculate the total order amount for each group
        },
      },
    ]);
    const countries=await Country.populate(user,{path:"_id",select:"_id name"})
    return res.send(countries);

  } catch (err) {
    // Pass the error to the error handler
    next(err);
  }
});

app.get("/destinations-stats",[auth,isAdmin], async(req, res, next) => {
  try {
    // const origin=await 
    const user=await DestinationUser.aggregate([
      {
        $group: {
          _id: '$destination', // Group by the customerId field
          totalUsers: { $sum: 1 }, // Calculate the total order amount for each group
        },
      },
    ]);
    const countries=await Country.populate(user,{path:"_id",select:"_id name"})
    return res.send(countries);

  } catch (err) {
    // Pass the error to the error handler
    next(err);
  }
});



app.get("/info", [auth], async (req, res) => {
  try {
    const info = await Info.find({});
    if (info.length === 0) {
      return res.status(500).send("Internal Server Error");
    }
    return res.send(info[0]);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

app.post("/info", async (req, res) => {
  try {
    let info = await Info.find({});
    if (info.length === 0) {
      return res.status(500).send("Something Went Wrong.");
    }
    const { name, full_address, contact_number, email, about } = req.body;
    info = info[0];
    info.name = name;
    info.full_address = full_address;
    info.contact_number = contact_number;
    info.email = email;
    info.about = about;
    await info.save();
    return res.send({"success":"Successfully updated."}); 
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

app.get("/download-csv-of-user", [auth, isAdmin], async (req, res) => {
  // Your Mongoose query, adjust as needed
  try {
    const query = await User.find({});

    const plainData = query.map((item) => item.toObject());

    // Define the fields you want to include in the CSV file
    const fields = [
      "first_name",
      "last_name",
      "email",
      "userType",
      "createdAt",
    ]; // Replace with your field names

    try {
      // Convert the data to CSV format
      const csvData = json2csv.parse(plainData, { fields });

      // Set response headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=exported_data.csv"
      );

      // Send the CSV data as a downloadable file
      res.send(csvData);
    } catch (err) {
      console.error("Error converting data to CSV:", err);
      return res.status(500).send("Internal Server Error");
    }
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
  // });
});

app.use("/uploads", express.static("uploads"));
app.use("/faqs", faqsRouter);
app.use("/tabs", tabsFrontRouter);
app.use("/admin/journey", journeyRouter);
app.use("/admin/stats", dataRouter);
app.use("/admin/tabs", tabsRouter);
app.use("/content/tabs", tabsRouterContent);
app.use("/content/content", contentContentRouter);
app.use("/admin/content", contentRouter);
app.use("/admin/languagewisetab", languageWiseTabRouter);
app.use("/login", loginRouter);
app.use("/admin/language", languageRouter);
app.use("/admin/image", imageRouter);
app.use("/user", userRouter);
app.use("/country", countryRouter);
app.use("/notification", notificationRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
