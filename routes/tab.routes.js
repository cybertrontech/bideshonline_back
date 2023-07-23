import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { Tabs } from "../models/Tabs.mjs";
import { Content } from "../models/Content.mjs";
import { Journery } from "../models/Journey.mjs";
import { Language } from "../models/Language.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import mongoose from "mongoose";
import { CustomError } from "../error/CustomError.mjs";
import { User } from "../models/User.mjs";
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// get all tabs list
router.get("/", auth, async (req, res, next) => {
  try {
  // const tabs = await Tabs.find({ active: true }).select("-__v -active");
  const user = await User.findById(req.user.userId);
  if (user === null) {
    return next(new CustomError(404, "User with this id doesn't exist."));
  }
  const tabs = await Tabs.aggregate([
    {
      $lookup: {
        from: "languagewisetabs",
        localField: "_id",
        foreignField: "tab",
        as: "alternate",
      },
    },
    {
      $unwind: { path: "$alternate", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        "alternate._id": 0,
        "alternate.createdAt": 0,
        "alternate.updatedAt": 0,
        "alternate.__v": 0,
      },
    },
    {
      $addFields: {
        hasAlternate: {
          $cond: {
            if: { $isArray: "$alternate" },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $match: {
        $or: [
          { hasAlternate: false }, // Retain documents without "alternate" field
          { "alternate.language": new ObjectId(user.language) }, // Match valid language ID
        ],
      },
    },
    {
      $project: {
        hasAlternate: 0, // Remove the temporary field used for matching
      },
    },
    // {
    //   $match: {
    //     "alternate.language": new ObjectId("64aed0d17de756ca24eff40d"),
    //   },
    // },
  ]);
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

    const languages = await Language.find({ country: originId }).select("-__v");

    if (langId === undefined || langId === null) {
      const content = await Content.find({
        //   tab: req.params.tabId,
        //   journey
      })
        .populate({ path: "language", select: { name: 1 } })
        .populate({ path: "creator", select: { first_name: 1, last_name: 1 } })
        .select("-__v -active");
      //   const tabs = await Tabs.find({ active: true }).select("-__v -active");
      if (content.length === 0) {
        return next(new CustomError(404, "This content doesn't exist."));
      }
      const newCon = content.filter((x) => x.language.name === "English");
      if (newCon.length === 0) {
        return res.send({ ...content[0]._doc, languages });
      } else {
        return res.send({ ...newCon[0]._doc, languages });
      }
    } else {
      const content = await Content.find({
        //   tab: req.params.tabId,
        //   journey,
        //   language: req.params.journeyId,
      })
        .populate({ path: "language", select: { name: 1 } })
        .populate({
          path: "creator",
          select: { first_name: 1, last_name: 1, image: 1 },
        })
        .select("-__v -active");

      //   const tabs = await Tabs.find({ active: true }).select("-__v -active");
      if (content.length === 0) {
        return next(new CustomError(404, "This content doesn't exist."));
      }
      let x = content[0];
      return res.send({ ...x._doc, languages });
    }
    // } catch (e) {
    //   return next(new Error());
    // }
  }
);

export default router;
