import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { CustomError } from "../error/CustomError.mjs";
dotenv.config();

const isAdmin = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    const isAdmin = decoded.isAdmin;
    if (isAdmin) {
      return next();
    }

    return next(
      new CustomError(403, `You are not authorized to perform this action.`)
    );
  } catch (e) {
    return next(new CustomError(403, `${e.message}`));
  }
};

export  {isAdmin};
