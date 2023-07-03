import dotenv from "dotenv"
import { CustomError } from "../../error/CustomError.mjs";
import jwt from "jsonwebtoken"
dotenv.config()

const auth = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (token === undefined) {
    req.user = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    return next(new CustomError(403,`${e.message}`))
  }

};

export default auth;
