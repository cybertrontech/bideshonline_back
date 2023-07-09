import { CustomError } from "../error/CustomError.mjs";
import { Content } from "../models/Content.mjs";
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
      .populate("language");
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
  try {
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
    });
    await cont.save();

    return res.send({ message: "Content sucessfully created." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const updateContentController = async (req, res, next) => {
  try {
    const {  journey, language, data } = req.body;
    // Validate the request body against the schema
    const { error } = contentUpdateValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const con = await Content.findOne({ _id: req.params.contentId });
    if (con === null) {
      return next(
        new CustomError(
          404,
          "Content doesn't exist."
        )
      );
    }
    // const cont = new Content({
    //   tab,
    //   journey,
    //   language,
    //   data,
    // });
    con.journey=journey;
    con.language=language;
    con.data=data;
    await con.save();

    return res.send({ message: "Content sucessfully updated." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  getContentController,
  createContentController,
  getContentByIdController,
  updateContentController
};
