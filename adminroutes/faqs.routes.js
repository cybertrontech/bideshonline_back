import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import {
  getFaqsController,
  createFaqsController,
  updateFaqsController,
  deleteFaqsController,
  createFaqsAdminController,
  getFaqsControllerById,
  getFaqsControllerByDestinationId,
} from "../admincontrollers/faqs.controller.mjs";
const router = express.Router();

//get all faqs
router.get("/", [auth], getFaqsController);

// get all faqs by journeyId
router.get("/:journeyId", [auth], getFaqsControllerById);

//get all faqs by destinationId
router.get(
  "/destination/:destinationId",
  [auth],
  getFaqsControllerByDestinationId
);

//
router.post("/for-admin", [auth, isAdmin], createFaqsAdminController);

//create new faq
router.post("/", [auth], createFaqsController);

//update new faq
router.put("/:faqId", [auth, isAdmin], updateFaqsController);

//delete new faq
router.delete("/:faqId", [auth, isAdmin], deleteFaqsController);

export default router;
