import { CustomError } from "../error/CustomError.mjs";
import {Faqs} from "../models/Faqs.mjs"

const getFaqsController = async (req, res, next) => {
  try {
    const faqs=await Faqs.find({});
    return res.send(faqs);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};
export { getFaqsController };
