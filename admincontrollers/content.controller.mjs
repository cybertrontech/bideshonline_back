import { CustomError } from "../error/CustomError.mjs";
import { Content } from "../models/Content.mjs";
import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const contentValidationSchema = Joi.object({
  tab: jObjId(),
  journey: jObjId(),
  data: Joi.string().required(),
});

const getContentController = async (req, res, next) => {
  try {
    const tabId = req.params.tabId;
    const content = await Content.find({ tab: tabId });
    return res.send(content);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createContentController = async (req, res, next) => {
  try {
    const { tab, journey, data } = req.body;
    // Validate the request body against the schema
    const { error } = contentValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const con=await Content.find({journey:journey,tab:tab})
    if(con.length>0)
    {

    return next(new CustomError(404, "Content Already Exists."));
    }
    const cont=new Content({
      tab,
      journey,
      data
    })
    await cont.save();

    return res.send({message:"Content sucessfully created."});
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }

};

export { getContentController, createContentController };
