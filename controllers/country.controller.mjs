import { CustomError } from "../error/CustomError.mjs";
import { Country } from "../models/Country.mjs";
import { Language } from "../models/Language.mjs";
import { DestinationUser } from "../models/User.mjs";
// const ObjectId = mongoose.Types.ObjectId;
// mongoose

const getAllCountryController = async (req, res, next) => {
  try {
    const countries = await Country.find({}).select("-__v -active");
    return res.send(countries);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getLanguageByCountryController = async (req, res, next) => {
  try {
    const language = await Language.find({ country: req.params.countryId });
    return res.send(language);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getDestinationCountryController = async (req, res, next) => {
  try {
    const countries = await DestinationUser.find({})
      .populate({ path: "destination", select: "_id name" })
      .select("-__v -user");
    return res.send(countries);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getDestinationCountryControllerByUser = async (req, res, next) => {
  try {
    console.log(req.user.userId);
    const countries = await DestinationUser.find({user:req.user.userId})
      .populate({ path: "destination", select: "_id name" })
      .select("-__v -user");
    return res.send(countries);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const addtDestinationCountryController=async(req,res,next)=>{
  try {
    const {destination}=req.body;
    let finalDest=[];
    await DestinationUser.deleteMany({user:req.user.userId});
    for(let i=0;i<destination.length;i++)
    {
      finalDest.push({user:req.user.userId,destination:destination[i]})
    }
    await DestinationUser.insertMany(finalDest);

    return res.send(finalDest);

  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
}
export {
  getAllCountryController,
  getLanguageByCountryController,
  getDestinationCountryController,
  getDestinationCountryControllerByUser,
  addtDestinationCountryController
};
