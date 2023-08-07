import express from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { isContentCreator } from "../middleware/content.mjs";
import {
  createContentController,
  getContentByIdController,
  getContentController,
  updateContentController,
} from "../admincontrollers/content.controller.mjs";
// import {Contentcreatorcountry} from "../models/ContentCreatorCountry.mjs"
import { isAdmin } from "../middleware/admin.mjs";
import { Content } from "../models/Content.mjs";
import Joi from "joi";
import jId from "joi-objectid";
import { CustomError } from "../error/CustomError.mjs";
import { Journery } from "../models/Journey.mjs";
import { Contentcreatorcountry } from "../models/ContentCreatorCountry.mjs";
const jObjId = jId(Joi);
const router = express.Router();

const contentUpdateValidationSchema = Joi.object({
  title: Joi.string().required(),
  journey: jObjId(),
  language: jObjId(),
  data: Joi.string().required(),
});

const contentValidationSchema = Joi.object({
  title: Joi.string().required(),
  tab: jObjId(),
  journey: jObjId(),
  language: jObjId(),
  data: Joi.string().required(),
});

// //get one tab
router.get(
  "/list/journey",
  [auth, isContentCreator],
  async (req, res, next) => {
    try {
      // const contentCreatorCountry = await Contentcreatorcountry.find({
      //   creator: req.user.userId,
      // });
      // console.log(contentCreatorCountry);

      const journey = await Journery.aggregate([
        {
          $lookup: {
            from: "contentcreatorcountries",
            localField: "origin",
            foreignField: "country",
            as: "jor",
          },
        },
        {
          $unwind: "$jor",
        },
        {
          $project: {
            jor: 0,
            __v: 0,
          },
        },
      ]);
      const populatedJourney = await Journery.populate(journey, {
        path: "origin destination",
        select: "_id name",
      });
      return res.send(populatedJourney);
    } catch (e) {
      return next(new CustomError(500, "Something Went Wrong!"));
    }
  }
);

//get all tabs
router.get("/:tabId", [auth, isContentCreator], async (req, res, next) => {
  try {
    const tabId = req.params.tabId;

    const content = await Content.find({ tab: tabId, creator: req.user.userId })
      .sort("-journey")
      .populate({
        path: "journey",
        populate: {
          path: "origin destination",
          select: "_id name",
        },
      })
      .populate("language");
    return res.send(content);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

// //get one tab
router.get(
  "/content/:contentId",
  [auth, isContentCreator],
  async (req, res, next) => {
    try {
      const con = await Content.findOne({ _id: req.params.contentId })
        .populate("journey")
        .populate("language");
      if (con.length === 0) {
        return next(
          new CustomError(404, "Content with this id doesn't exist.")
        );
      }
      const a = con.creator.toString();
      const b = new ObjectId(req.user.userId).toString();

      if (a !== b) {
        return next(new CustomError(403, "You can't perform this action."));
      }

      return res.send({ content: con });
    } catch (e) {
      return next(new CustomError(500, "Something Went Wrong!"));
    }
  }
);

// // create tabs content
router.post("/:tabId", [auth, isContentCreator], async (req, res, next) => {
  try {
    const { tab, journey, language, data, title } = req.body;
    // Validate the request body against the schema
    const { error } = contentValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const actJour = await Journery.findById(journey);
    if (actJour === null) {
      return next(new CustomError(404, "Journey with this id doesn't exists."));
    }

    const con = await Content.find({
      journey: journey,
      language: language,
      tab: tab,
    });
    if (con.length > 0) {
      return next(
        new CustomError(
          404,
          "Content with this journey and language already exists."
        )
      );
    }
    const contentCreatorCountryIsActual = await Contentcreatorcountry.find({
      creator: req.user.userId,
      country: actJour.origin,
    });
    if (contentCreatorCountryIsActual.length === 0) {
      return next(new CustomError(404, "Sorry you cannot post this content."));
    }
    const cont = new Content({
      tab,
      journey,
      language,
      data,
      creator: req.user.userId,
      title,
      creator: req.user.userId,
    });
    await cont.save();

    return res.send({ message: "Content sucessfully created." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

// //update tabs
router.post(
  "/content/:contentId",
  [auth, isContentCreator],
  async (req, res, next) => {
    try {
      const { journey, language, data, title } = req.body;
      // Validate the request body against the schema
      const { error } = contentUpdateValidationSchema.validate(req.body);

      // Check for validation errors
      if (error) {
        return next(new CustomError(400, error.details[0].message));
      }

      const con = await Content.findOne({ _id: req.params.contentId });
      if (con === null) {
        return next(new CustomError(404, "Content doesn't exist."));
      }

      const a = con.creator.toString();
      const b = new ObjectId(req.user.userId).toString();

      if (a !== b) {
        return next(new CustomError(403, "You can't perform this action bro."));
      }

      con.journey = journey;
      con.language = language;
      con.data = data;
      con.title = title;
      await con.save();

      return res.send({ message: "Content sucessfully updated." });
    } catch (e) {
      return next(new CustomError(500, "Something Went Wrong!"));
    }
  }
);

router.post(
  "/get-countries",
  [auth, isContentCreator],
  async (req, res, next) => {
    try {
      const courintes = await Contentcreatorcountry.find({
        creator: req.user.userId,
      });
      return res.send(courintes);
    } catch (e) {
      return next(new CustomError(500, "Something Went Wrong!"));
    }
  }
);

export default router;
