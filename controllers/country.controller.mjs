import { CustomError } from "../error/CustomError.mjs";
import { Country } from "../models/Country.mjs";

const getAllCountryController = async (req, res, next) => {
  try {
    const countries=await Country.find({}).select("-__v -active");
    return res.send(countries);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};


export { getAllCountryController };
