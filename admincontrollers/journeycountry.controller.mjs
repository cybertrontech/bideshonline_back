import { CustomError } from "../error/CustomError.mjs";
import { Journery } from "../models/Journey.mjs";
import { Country } from "../models/Country.mjs";

import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const countryValidationSchema = Joi.object({
  name: Joi.string().required(),
});

const journeyValidationSchema = Joi.object({
  origin: jObjId(),
  destination: jObjId(),
});

const getAllJourneyController = async (req, res, next) => {
  try {
    const journies = await Journery.find({})
      .populate("origin")
      .populate("destination");
    return res.send(journies);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createContryController = async (req, res, next) => {
  try {
    const { name } = req.body;
    // Validate the request body against the schema
    const { error, value } = countryValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const path = req.file.path;

    const countryE = await Country.find({ name: name });
    if (countryE.length > 0) {
      return next(
        new CustomError(500, "Country with this name already exist.")
      );
    }

    const country = new Country({
      name,
      image: path,
    });
    await country.save();

    return res.send({ message: "Country Successfully Created." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const updateContryController = async (req, res, next) => {
  try {
  const { name } = req.body;
  // Validate the request body against the schema
  const { error, value } = countryValidationSchema.validate(req.body);

  // Check for validation errors
  if (error) {
    return next(new CustomError(400, error.details[0].message));
  }

  const path = req.file?.path;
  

  const countryE = await Country.findOne({ _id: req.params.countryId });

  // if (countryE.length > 0) {
  // return next(new CustomError(500, "Country with this name already exist."));
  // }
  countryE.name = name;
  if (path !== undefined) {
    countryE.image = path;
  }
  await countryE.save();

  // const country = new Country({
  //   name,
  //   image: path,
  // });
  // await country.save();

  return res.send({ message: "Country Successfully Updated.", path: path });

  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createJourneyController = async (req, res, next) => {
  try {
    const { origin, destination } = req.body;

    if (origin === destination) {
      return next(
        new CustomError(400, "The origin and destination cannot be same.")
      );
    }

    // Validate the request body against the schema
    const { error, value } = journeyValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const alreadyExists = await Journery.find({ origin, destination });
    if (alreadyExists.length > 0) {
      return next(new CustomError(404, "This Journey already exists."));
    }

    const journey = new Journery({
      origin,
      destination,
    });
    await journey.save();

    return res.send({ message: "Journey Has Been Successfully Created." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  getAllJourneyController,
  createContryController,
  createJourneyController,
  updateContryController,
};
