import { CustomError } from "../error/CustomError.mjs";
import { Languagewisetab } from "../models/LanguageWiseTabName.mjs";
import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const languageWiseTabNameValidationSchema = Joi.object({
    language_wise_title: Joi.string().alphanum().required(),
    language: jObjId(),
});

const getLanguageWiseTabsController = async (req, res, next) => {
  try {
    const lwtb = await Languagewisetab.find({}).populate({path:"language",select:"_id name"});
    return res.send(lwtb);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createLanguageWiseTabsController = async (req, res, next) => {
//   try {
    const {language_wise_title,language}=req.body;
    const { error } = languageWiseTabNameValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }
    const alreadyExists=await Languagewisetab.find({language,tab:req.params.tabId}) 
    if(alreadyExists.length!==0)
    {
    return next(new CustomError(404, "The tab name with this tab and country already exists."));
    }
    const tabNameLanguageWise=new Languagewisetab({
        language_wise_title,
        language,
        tab:req.params.tabId
    })
    await tabNameLanguageWise.save();
    return res.send({message:"Successfully added alternate name."})
    // const {}=
    //   const lwtb=await Languagewisetab.find({});
    //   return res.send(lwtb);
//   } catch (e) {
//     return next(new CustomError(500, "Something Went Wrong!"));
//   }
};
export { getLanguageWiseTabsController, createLanguageWiseTabsController };
