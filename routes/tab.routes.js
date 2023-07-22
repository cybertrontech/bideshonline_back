import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { Tabs } from "../models/Tabs.mjs";
import { Content } from "../models/Content.mjs";
import { Journery } from "../models/Journey.mjs";
import { Language } from "../models/Language.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import { CustomError } from "../error/CustomError.mjs";
const router = express.Router();

// get all tabs list
router.get("/", auth, async (req, res, next) => {
  try {
    const tabs = await Tabs.find({ active: true }).select("-__v -active");
    return res.send(tabs);
  } catch (e) {
    return next(new Error());
  }
});

// get content by tab id
router.get(
  "/:tabId/:originId/:destinationId/:languageId?",
  auth,
  async (req, res, next) => {
    // try {
    const langId = req.params.languageId;
    const { originId, destinationId } = req.params;

    const journey = await Journery.findOne({
      origin: originId,
      destination: destinationId,
    });

    if (journey === null) {
      return next(new CustomError(404, "This content doesn't exist."));
    }

    const languages=await Language.find({country:originId}).select("-__v")

    if (langId === undefined || langId === null) {
      const content = await Content.find({
        //   tab: req.params.tabId,
        //   journey
      })
        .populate({ path: "language", select: { name: 1 } })
        .populate({path:"creator",select:{first_name:1,last_name:1}})
        .select("-__v -active");
      //   const tabs = await Tabs.find({ active: true }).select("-__v -active");
      if (content.length === 0) {
        return next(new CustomError(404, "This content doesn't exist."));
      }
      const newCon = content.filter((x) => x.language.name === "English");
      if (newCon.length === 0) {
        return res.send({...content[0]._doc,languages});
      } else {
        return res.send({...newCon[0]._doc,languages});
      }
    } else {
      const content = await Content.find({
        //   tab: req.params.tabId,
        //   journey,
        //   language: req.params.journeyId,
      })
        .populate({ path: "language", select: { name: 1 } })
        .populate({path:"creator",select:{first_name:1,last_name:1,image:1}})
        .select("-__v -active");
      
      //   const tabs = await Tabs.find({ active: true }).select("-__v -active");
      if (content.length === 0) {
        return next(new CustomError(404, "This content doesn't exist."));
      }
      let x=content[0];
      return res.send({...x._doc,languages});
    }
    // } catch (e) {
    //   return next(new Error());
    // }
  }
);

export default router;
