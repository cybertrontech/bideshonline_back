import { CustomError } from "../error/CustomError.mjs";
import { Tabs } from "../models/Tabs.mjs";
// const countryValidationSchema = Joi.object({
//   name: Joi.string().required(),
// });

// const journeyValidationSchema = Joi.object({
//   origin: jObjId(),
//   destination: jObjId()
// });

const createTabsController = async (req, res, next) => {
  try {
    const { title } = req.body;
    const path = req.file.path;
    const tab = await Tabs.find({ title: title });
    if (tab.length > 0) {
      return next(new CustomError(500, "Tab with this name already exist."));
    }
    const tabs = new Tabs({
      title,
      image: path,
    });
    await tabs.save();
    return res.send({ message: "Successfully Added The Tab." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getTabsController=async (req, res, next) => {
  try {
   const tabs=await Tabs.find({}) 
   return res.send(tabs)
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};
export { createTabsController,getTabsController };
