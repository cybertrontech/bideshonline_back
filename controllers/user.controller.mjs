import Joi from "joi";
import { DestinationUser, User } from "../models/User.mjs";
import bcrypt from "bcrypt";
import { CustomError } from "../error/CustomError.mjs";
import jId from "joi-objectid";
import { generateRandomString } from "../utils/randomCodeGenerator.mjs";
import { sendEmail } from "../utils/mailer.mjs";
const jObjId = jId(Joi);

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const newPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required().min(8).max(8),
  password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

const userValidationSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().allow("").optional(),
  origin: Joi.string().required(),
  destination: Joi.array().items(Joi.string()).required(),
  language: Joi.string().required(),
});

const userValidationSchemaForGoogle = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().allow(""),
  email: Joi.string().email().required(),

  deviceId: Joi.string().allow("").optional(),
  origin: Joi.string().required(),
  destination: Joi.array().items(Joi.string()).required(),
  language: Joi.string().required(),
});

const userValidationSchemaForAdmin = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().allow(""),
  email: Joi.string().email().required(),
});

const userValidationAdminSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  type: Joi.string().required(),
  deviceId: Joi.string().allow("").optional(),
});

const getUserByIdController = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("_id first_name last_name email phonenumber image origin language")
      .populate({ path: "origin", select: "_id name" })
      .populate({ path: "language", select: "_id name" });

    if (user === null) {
      return next(new CustomError(404, "User with this id doesn't exist."));
    }

    const destUsers = await DestinationUser.find({ user: req.params.userId })
      .populate({ path: "destination", select: "_id name" })
      .select("_id destination");

    return res.send({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      origin: user.origin,
      language: user.language,
      destination: destUsers,
    });
  } catch (e) {
    // // console.log(e);
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getAllUsersController = async (req, res, next) => {
  try {
    const userType = req.params.userType;

    if (userType === "n") {
      User.find({ userType: "normal" })
        .select("-password -deviceId -__v")
        .sort("-updatedAt")
        .then((users) => {
          return res.status(200).json(users);
        })
        .catch((error) => {
          return next(new CustomError(500, error.message));
          // return res.status(500).json({ error: error.message });
        });
    } else if (userType === "c") {
      User.find({ userType: "content" })
        .select("-password -deviceId -__v")
        .sort("-updatedAt")
        .then((users) => {
          return res.status(200).json(users);
        })
        .catch((error) => {
          return next(new CustomError(500, error.message));
        });
    } else if (userType === "a") {
      User.find({ userType: "admin" })
        .select("-password -deviceId -__v")
        .sort("-updatedAt")
        .then((users) => {
          return res.status(200).json(users);
        })
        .catch((error) => {
          return next(new CustomError(500, error.message));
        });
    } else {
      return res.send([]);
    }
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong"));
  }
};

const createUserController = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      deviceId,
      origin,
      destination,
      language,
    } = req.body;
    // Validate the request body against the schema
    const { error, value } = userValidationSchema.validate(req.body);
    // // console.log(value);

    const destinations = [];

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
      origin,
      language,
    });

    for (let i = 0; i < destination.length; i++) {
      destinations.push({ user: newUser._id, destination: destination[i] });
    }

    newUser = await newUser.save();
    await DestinationUser.insertMany(destinations);

    return res.status(200).json({ message: "Successfully Registered." });
  } catch (e) {
    // console.log(e);
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createUserControllerGoogle = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      // deviceId,
      origin,
      destination,
      language,
    } = req.body;
    // Validate the request body against the schema
    const { error, value } = userValidationSchemaForGoogle.validate(req.body);
    // // console.log(value);

    const destinations = [];

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const usr = await User.find({ email });

    if (usr.length > 0) {
      return next(new CustomError(400, "User with this email already exists."));
    }

    const salt = await bcrypt.genSalt(10);

    const password = `${process.env.PRIVATE_KEY}${email}`;
    const newpass = await bcrypt.hash(password, salt);

    let newUser = new User({
      first_name,
      last_name,
      email,
      password: newpass,
      userType: "normal",
      // deviceId,
      origin,
      language,
    });

    for (let i = 0; i < destination.length; i++) {
      destinations.push({ user: newUser._id, destination: destination[i] });
    }

    newUser = await newUser.save();
    await DestinationUser.insertMany(destinations);

    return res.status(200).json({ message: "Successfully Registered." });
  } catch (e) {
    // console.log(e);
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createUserControllerByAdmin = async (req, res, next) => {
  // try {
  const { first_name, last_name, email, password, deviceId, type } = req.body;
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
    deviceId,
  });

  newUser = await newUser.save();

  return res.status(200).json({ message: "Successfully Registered." });
  // } catch (e) {
  //   // console.log(e);
  //   return next(new CustomError(500, "Something Went Wrong!"));
  // }
};

const getUserTypeController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("userType");
    // console.log(user);
    return res.send({ type: user });
  } catch (e) {
    // console.log(e);
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const editUserController = async (req, res, next) => {
  try {
    const { first_name, last_name, type, origin, email } = req.body;
    const user = await User.findById(req.params.userId);
    user.first_name = first_name;
    user.last_name = last_name;
    user.userType = type;
    user.origin = origin;
    user.email = email;
    await user.save();
    return res.status(200).json({ message: "Successfully Updated." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const editUserStatusController = async (req, res, next) => {
  try {
    // const {first_name,last_name,type}=req.body;
    const user = await User.findById(req.params.userId);
    // user.first_name=first_name;
    // user.last_name=last_name;
    user.verified = !user.verified;
    await user.save();
    return res.status(200).json({
      message: "Successfully changed the status.",
      status: user.verified,
    });
    // return res.send("edited");
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const editFrontUserController = async (req, res, next) => {
  // try {

  const { first_name, last_name, email, origin, language } = req.body;
  const user = await User.findById(req.user.userId);

  if (user === null) {
    return next(new CustomError(404, "User doesn't exist."));
  }

  user.first_name = first_name;
  user.last_name = last_name;
  user.email = email;
  user.origin = origin;
  user.language = language;
  await user.save();

  // return res.send(user);

  return res.status(200).json({
    message: "Successfully updated your profile.",
  });
  // return res.send("edited");
  // } catch (e) {
  //   return next(new CustomError(500, "Something Went Wrong!"));
  // }
};

const editFrontUserWithImageController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, origin, language } = req.body;
    const user = await User.findById(req.user.userId);
    if (user === null) {
      return next(new CustomError(404, "User doesn't exist."));
    }

    const path = req.file?.path;

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.origin = origin;
    user.language = language;
    if(path)
    {
      user.image = path;
    }
    await user.save();

    return res.status(200).json({
      message: "Successfully updated your profile.",
      image: user.image,
    });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const editFrontUserAdvanceController = async (req, res, next) => {
  try {
    const { destination, origin, language } = req.body;
    let finalDest = [];
    const user = await User.findById(req.user.userId);
    if (user === null) {
      return next(new CustomError(404, "User with this id doesn't exist."));
    }

    await DestinationUser.deleteMany({ user: req.user.userId });
    for (let i = 0; i < destination.length; i++) {
      finalDest.push({ user: req.user.userId, destination: destination[i] });
    }

    await DestinationUser.insertMany(finalDest);
    user.origin = origin;
    user.language = language;
    await user.save();

    return res.send({ message: "Successfully updated." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user == null) {
      return next(new CustomError(404, "User with this email doesn't exist."));
    }
    const code = generateRandomString(8);
    user.forgotPasswordCode = code;
    user.forgotCodeExpired = false;
    try {
      const subject = "Forgot Password";
      const text = `Dear ${user.first_name} ${user.last_name}, Please donot share this with anyone. Your password recovery code is : ${code}`;

      await sendEmail(email, code, subject, text);

      await user.save();

      return res.send({
        message: "Code successfully sent to your mail.Please check your email.",
      });
    } catch (e) {
      return next(new CustomError(500, "Something Went Wrong In Mail!"));
    }
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const newPassword = async (req, res, next) => {
  try {
    const { error } = newPasswordSchema.validate(req.body);
    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }
    const { email, code, password } = req.body;

    const user = await User.findOne({ email });
    if (user == null) {
      return next(new CustomError(404, "User with this email doesn't exist."));
    }

    const salt = await bcrypt.genSalt(10);
    const newpass = await bcrypt.hash(password, salt);

    if (user.forgotPasswordCode === code && user.forgotCodeExpired === false) {
      user.forgotCodeExpired = true;
      user.password = newpass;
      await user.save();
      return res.send({
        message: "Your password has been successfully updated.",
      });
    }
    return next(
      new CustomError(
        404,
        "Sorry your reset-code isn't correct. Please try again!"
      )
    );
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const { old_password, new_password } = req.body;
    const user = await User.findById(req.user.userId);
    if (user === null) {
      return next(new CustomError(404, "User doesn't exist.!"));
    }
    const match = await bcrypt.compare(old_password, user.password);
    if (match) {
      const salt=await bcrypt.genSalt(10);
      const newpass=await bcrypt.hash(new_password,salt);
      user.password=newpass;
      await user.save();
      return res.send({"message":"Your password has been successfully updated."})
    } else {
      return next(new CustomError(403, "Your old password doesn't match."));
    }
    return res.send(match);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getUserByTokenAdminController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "_id first_name last_name email"
    );
    if (user === null) {
      return next(new CustomError(404, "User this id doesn't exist."));
    }
    return res.send(user);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const editUserByTokenAdminController = async (req, res, next) => {
  try {
    const { first_name, last_name, email } = req.body;

    const { error } = userValidationSchemaForAdmin.validate(req.body);
    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }
    const user = await User.findById(req.user.userId);
    if (user === null) {
      return next(new CustomError(404, "User this id doesn't exist."));
    }
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;

    await user.save();

    return res.send({ first_name, last_name, email });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  createUserController,
  editUserStatusController,
  createUserControllerByAdmin,
  getAllUsersController,
  getUserTypeController,
  editUserController,
  editFrontUserController,
  editFrontUserWithImageController,
  getUserByIdController,
  editFrontUserAdvanceController,
  forgotPassword,
  newPassword,
  createUserControllerGoogle,
  getUserByTokenAdminController,
  editUserByTokenAdminController,
  resetPassword,
};
