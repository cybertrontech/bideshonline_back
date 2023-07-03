import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { CustomError } from "../../error/CustomError.mjs";
dotenv.config();

const isContentCreator = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;

    const isContentCreator = decoded.isContentCreator;
    if (isContentCreator) {
      return next();
    }

    return next(
      new CustomError(403, `You are not authorized to perform this action.`)
    );
  } catch (e) {
    return next(new CustomError(403, `${e.message}`));
  }
};

export default isContentCreator;
