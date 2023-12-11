import { CustomError } from "../error/CustomError.mjs";
import { Language } from "../models/Language.mjs";
import { Country } from "../models/Country.mjs";
import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const languageValidationSchema = Joi.object({
  name: Joi.string().required(),
  country: jObjId(),
});

// const countryValidationSchema = Joi.object({
//   name: Joi.string().required(),
// });

// const journeyValidationSchema = Joi.object({
//   origin: jObjId(),
//   destination: jObjId()
// });

// const createTabsController = async (req, res, next) => {
//   try {
//     const { title } = req.body;
//     const path = req.file.path;
//     const tab = await Tabs.find({ title: title });
//     if (tab.length > 0) {
//       return next(new CustomError(500, "Tab with this name already exist."));
//     }
//     const tabs = new Tabs({
//       title,
//       image: path,
//     });
//     await tabs.save();
//     return res.send({ message: "Successfully Added The Tab." });
//   } catch (e) {
//     return next(new CustomError(500, "Something Went Wrong!"));
//   }
// };

const getLanguageController = async (req, res, next) => {
  try {
    const lang = await Language.find({}).populate("country");
    return res.send(lang);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getLanguageControllerId = async (req, res, next) => {
  try {
    const lang = await Language.find({ country: req.params.countryId });
    return res.send(lang);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createLanguageController = async (req, res, next) => {
  try {
    const { name, country } = req.body;

    // Validate the request body against the schema
    const { error } = languageValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const lang = await Language.find({ name, country });
    if (lang.length > 0) {
      return next(
        new CustomError(400, "Language with this name already exists.")
      );
    }

    const lan = new Language({ name, country });
    await lan.save();
    return res.send({ message: "Language successfully created." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const updateLanguageController = async (req, res, next) => {
  try {
    const { name, country } = req.body;

    // Validate the request body against the schema
    const { error } = languageValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const lang = await Language.findOne({ _id: req.params.languageId });
    lang.name = name;
    lang.country = country;
    const c = await Country.findOne({ _id: lang.country });
    await lang.save();
    // if (lang.length > 0) {
    //   return next(
    //     new CustomError(400, "Language with this name already exists.")
    //   );
    // }

    // const lan = new Language({ name, country });
    // await lan.save();

    return res.send({
      message: "Language successfully updated.",
      country: c.name,
    });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const deleteLanguageController = async (req, res, next) => {
  try {
    await Language.findByIdAndDelete(req.params.languageId);
    return res.send({ message: "Language successfully deleted." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  getLanguageController,
  createLanguageController,
  getLanguageControllerId,
  updateLanguageController,
  deleteLanguageController,
};
