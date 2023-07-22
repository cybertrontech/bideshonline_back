import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { CustomError } from "../error/CustomError.mjs";
dotenv.config()

const auth = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  // if (token === undefined) {
  //   req.user = null;
  //   next();
  //   return;
  // }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    return next(new CustomError(403,`${e.message}`))
  }

};
export  { auth };
