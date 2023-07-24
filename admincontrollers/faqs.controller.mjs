import { CustomError } from "../error/CustomError.mjs";
import { Faqs } from "../models/Faqs.mjs";
import Joi from "joi";

const createFaqSchema = Joi.object({
  question: Joi.string().required(),
});

const getFaqsController = async (req, res, next) => {
  try {
    const faqs = await Faqs.find({active:true}).select("-__v -active");
    return res.send(faqs);
  } catch (e) {
    return next(new CustomError(500, "Something Went Wrong!"));
  }
};

const createFaqsController = async (req, res, next) => {
  try {
    const { question } = req.body;
    const { error, value } = createFaqSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      return next(new CustomError(400, error.details[0].message));
    }

    const faq = new Faqs({
      question,
    });
    await faq.save();
    return res.send({...faq._doc});
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
};
