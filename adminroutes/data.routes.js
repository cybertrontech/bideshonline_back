import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import { Tabs } from "../models/Tabs.mjs";
import { Language } from "../models/Language.mjs";
// import { Journey } from "../models/Journey.mjs";
import { Country } from "../models/Country.mjs";
import { Journery } from "../models/Journey.mjs";
import { User } from "../models/User.mjs";
const router = express.Router();

//get all tabs
router.get("/", [auth, isAdmin], async (req, res) => {
  try {

    const tabs = await Tabs.find({});
    const languages = await Language.find({});
    const aUsers = await User.find({active:true});
    const iUsers = await User.find({active:false});


    const journey = await Journery.find({});
    const country = await Country.find({});


    return res.send({
      tabs: tabs.length,
      languages: languages.length,
      journey: journey.length,
      country: country.length,
      aUsers:aUsers.length,
      iUsers:iUsers.length

    });
  } catch (e) {
    return next(new Error());
  }
});

// create tabs

export default router;
