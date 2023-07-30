import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import { Info } from "../models/InfoModel.mjs";
import { CustomError } from "../error/CustomError.mjs";
const router = express.Router();
import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const infoValidationSchema = Joi.object({
  name: Joi.string().required(),
  full_address: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  contact_number: Joi.string().required(),
  about: Joi.string().required(),
});

//get all tabs
router.get("/", [auth, isAdmin], async (req, res, next) => {
  try {
    const info = await Info.find({});

    if (info.length === 0) {
      return next(new CustomError(404, "Info doesn't exist."));
    };

    return res.send(info[0]);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

router.put("/", [auth, isAdmin], async (req, res, next) => {
  try {
    const { name, full_address, email, contact_number, about } = req.body;

    // Validate the request body against the schema
    const { error } = infoValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    let tab = await Info.find({});

    if (tab.length === 0) {
      // return next(new CustomError(404, "Tab with this id doesn't exist."));
      const t = new Info({
        name,
        email,
        full_address,
        contact_number,
        about,
      });
      await t.save();
      return res.send({ message: "Successfully Created Your Info." });
    }

    tab = tab[0];

    tab.name = name;
    tab.full_address = full_address;
    tab.email = email;
    tab.contact_number = contact_number;
    tab.about = about;
    tab.save();

    return res.send({ message: "Successfully Updated Your Info." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
});

export default router;
