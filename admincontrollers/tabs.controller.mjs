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

const getTabsController = async (req, res, next) => {
  try {
    const tabs = await Tabs.find({});
    return res.send(tabs);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const activateDeactivateTabController = async (req, res, next) => {
  try {
    const { activate } = req.body;
    const tab = await Tabs.findOne({ _id: req.params.tabId });
    tab.active = !tab.active;
    await tab.save();
    return res.send({ message: "Successfully changed the status." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const deleteTabsController = async (req, res, next) => {
  try {
    await Tabs.findOneAndDelete({ _id: req.params.tabId });
    return res.send({ message: "Successfully deleted the tab." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const updateTabsController = async (req, res, next) => {
  try {
    const { title } = req.body;
    const path = req?.file?.path;
    let tab = await Tabs.findById({ _id: req.params.tabId });
    if (tab === null) {
      return next(new CustomError(404, "Tab with this id doesn't exist."));
    }
    tab.title = title;
    if (path) {
      tab.image = path;
    }
    tab.save();

    return res.send({ message: "Successfully updated this tab." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  createTabsController,
  getTabsController,
  activateDeactivateTabController,
  deleteTabsController,
  updateTabsController,
};
