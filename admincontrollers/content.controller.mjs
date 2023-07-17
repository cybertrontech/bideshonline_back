import { CustomError } from "../error/CustomError.mjs";
import { Content } from "../models/Content.mjs";
import { User } from "../models/User.mjs";
import { Contentcreatorcountry } from "../models/ContentCreatorCountry.mjs";
import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const contentValidationSchema = Joi.object({
  tab: jObjId(),
  journey: jObjId(),
  language: jObjId(),
  data: Joi.string().required(),
});

const contentUpdateValidationSchema = Joi.object({
  journey: jObjId(),
  language: jObjId(),
  data: Joi.string().required(),
});

const getContentController = async (req, res, next) => {
  try {
    const tabId = req.params.tabId;

    const content = await Content.find({ tab: tabId })
      .sort("-journey")
      .populate({
        path: "journey",
        populate: {
          path: "origin destination",
          select: "_id name",
        },
      })
      .populate("language")
      .populate({ path: "creator", select: "_id first_name last_name" });
    return res.send(content);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getContentByIdController = async (req, res, next) => {
  try {
    const con = await Content.findOne({ _id: req.params.contentId })
      .populate("journey")
      .populate("language");
    if (con.length === 0) {
      return next(new CustomError(404, "Content with this id doesn't exist."));
    }
    return res.send({ content: con });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createContentController = async (req, res, next) => {
  // try {
  const { tab, journey, language, data } = req.body;
  // Validate the request body against the schema
  const { error } = contentValidationSchema.validate(req.body);

  // Check for validation errors
  if (error) {
    return next(new CustomError(400, error.details[0].message));
  }

  const con = await Content.find({ journey: journey, tab: tab });
  if (con.length > 0) {
    return next(
      new CustomError(
        404,
        "Content with this journey and language already exists."
      )
    );
  }
  const cont = new Content({
    tab,
    journey,
    language,
    data,
    creator: req.user.userId,
  });
  await cont.save();

  return res.send({ message: "Content sucessfully created." });
  // } catch (e) {
  //   return next(new CustomError(500, "Something Went Wrong!"));
  // }
};

const updateContentController = async (req, res, next) => {
  try {
    const { journey, language, data } = req.body;
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

    con.journey = journey;
    con.language = language;
    con.data = data;
    await con.save();

    return res.send({ message: "Content sucessfully updated." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getContentCreatorCountriesByIdController = async (req, res, next) => {
  try {
    const countries = await Contentcreatorcountry.find({
      creator: req.user.userId,
    }).populate("country");
    const user = await User.findById(req.params.userId).select(
      "_id email first_name last_name userType"
    );
    console.log(user);
    if (user === null || user.userType !== "content") {
      return next(new CustomError(404, "This creator doesn't exist."));
    }

    return res.send({ countries, user });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createContentCreatorCountriesByIdController = async (req, res, next) => {
  try {
    const { country } = req.body;
    let countryCreatorConten = await Contentcreatorcountry.findOne({
      creator: req.user.userId,
      country: country,
    });

    if (countryCreatorConten !== null) {
      return next(
        new CustomError(
          404,
          "This content creator is already connected to this country."
        )
      );
    }

    countryCreatorConten = new Contentcreatorcountry({
      creator: req.user.userId,
      country,
    });
    await countryCreatorConten.save();
    // return res.send(countryCreatorConten);
    return res.send({ message: "Sucessfully created." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const deleteContentCreatorCountriesByIdController = async (req, res, next) => {
  try {
    await Contentcreatorcountry.findByIdAndDelete(req.params.contentCountryId);
    return res.send({ message: "Sucessfully deleted." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  getContentController,
  createContentController,
  getContentByIdController,
  updateContentController,
  getContentCreatorCountriesByIdController,
  createContentCreatorCountriesByIdController,
  deleteContentCreatorCountriesByIdController,
};
