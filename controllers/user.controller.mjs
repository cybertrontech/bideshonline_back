import Joi from "joi";
import { User } from "../models/User.mjs";
import bcrypt from "bcrypt";
import { CustomError } from "../error/CustomError.mjs";

const userValidationSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().allow("").optional(),
});

const userValidationAdminSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  type: Joi.string().required(),
  deviceId: Joi.string().allow("").optional(),
});

const getAllUsersController = (req, res, next) => {
  User.find({})
    .select("-password -deviceId -__v")
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((error) => {
      return next(new CustomError(500, error.message));
      // return res.status(500).json({ error: error.message });
    });
};

const createUserController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, deviceId } = req.body;
    // Validate the request body against the schema
    const { error, value } = userValidationSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const usr = await User.find({ email });

    if (usr.length > 0) {
      return next(new CustomError(400, "User with this email already exists."));
    }

    const salt = await bcrypt.genSalt(10);
    const newpass = await bcrypt.hash(password, salt);

    let newUser = new User({
      first_name,
      last_name,
      email,
      password: newpass,
      userType: "normal",
      deviceId,
    });

    newUser = await newUser.save();

    return res.status(200).json({ message: "Successfully Registered." });
  } catch (e) {
    console.log(e);
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};


const createUserControllerByAdmin = async (req, res, next) => {
  // try {
    const { first_name, last_name, email, password,deviceId, type } = req.body;
    // Validate the request body against the schema
    const { error, value } = userValidationAdminSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const usr = await User.find({ email });

    if (usr.length > 0) {
      return next(new CustomError(400, "User with this email already exists."));
    }

    const salt = await bcrypt.genSalt(10);
    const newpass = await bcrypt.hash(password, salt);

    let newUser = new User({
      first_name,
      last_name,
      email,
      password: newpass,
      userType: type,
      deviceId
    });

    newUser = await newUser.save();

    return res.status(200).json({ message: "Successfully Registered." });
  // } catch (e) {
  //   console.log(e);
  //   return next(new CustomError(500, "Something Went Wrong!"));
  // }
};

const getUserTypeController = async (req, res, next) => {
  try {
    const user =await User.findById(req.user.userId).select("userType")
    // console.log(user);
    return res.send({type:user});
  } catch (e) {
    console.log(e);
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const editUserController=async (req, res, next) => {
  // try{
    const {first_name,last_name,type}=req.body;
    const user=await User.findById(req.params.userId);
    user.first_name=first_name;
    user.last_name=last_name;
    user.userType=type;
    await user.save();
    return res.status(200).json({ message: "Successfully Updated." });
    // return res.send("edited");

  // }
  // catch(e){

  //   return next(new CustomError(500, "Something Went Wrong!"));
  // }

}

export { createUserController,createUserControllerByAdmin, getAllUsersController, getUserTypeController,editUserController };
