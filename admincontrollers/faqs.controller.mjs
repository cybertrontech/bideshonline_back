import { CustomError } from "../error/CustomError.mjs";
import { Faqs } from "../models/Faqs.mjs";
import Joi from "joi";
import jId from "joi-objectid";
const jObjId = jId(Joi);

const createFaqSchema = Joi.object({
  question: Joi.string().required(),
  journey: jObjId(),
});

const createFaqAdminSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  journey: jObjId(),
});

const getFaqsController = async (req, res, next) => {
  try {
    const faqs = await Faqs.find({ active: true })
      .populate({
        path: "journey",
        populate: { path: "origin destination", select: "_id name" },
      })
      .select("-__v -active")
      .sort("-createdAt");

    return res.send(faqs);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const getFaqsControllerById = async (req, res, next) => {
  try {
    const journeyId = req.params.journeyId;
    const faqs = await Faqs.find({journey:journeyId})
      .populate({
        path: "journey",
        populate: { path: "origin destination", select: "_id name" },
      })
      .select("-__v -active")
      .sort("-createdAt");

    return res.send(faqs);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};


const createFaqsController = async (req, res, next) => {
  try {
    const { question, journey } = req.body;
    const { error, value } = createFaqSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const faq = new Faqs({
      question,
      journey,
    });
    await faq.save();
    return res.send({ ...faq._doc });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createFaqsAdminController = async (req, res, next) => {
  try {
    const { question, answer, journey } = req.body;
    const { error, value } = createFaqAdminSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const faq = new Faqs({
      question,
      answer,
      journey,
    });
    await faq.save();
    return res.send({ ...faq._doc });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const updateFaqsController = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const faq = await Faqs.findById(req.params.faqId);
    if (faq === null) {
      return next(new CustomError(404, "This faq doesn't exist.!"));
    }

    faq.question = question;
    faq.answer = answer;
    await faq.save();
    return res.send({ message: "Successfully updated faq." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const deleteFaqsController = async (req, res, next) => {
  try {
    await Faqs.findByIdAndDelete(req.params.faqId);
    return res.send({ message: "Successfully deleted faq." });
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

export {
  getFaqsController,
  createFaqsController,
  updateFaqsController,
  deleteFaqsController,
  createFaqsAdminController,
  getFaqsControllerById
};
