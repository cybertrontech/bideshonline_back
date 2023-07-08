import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  createContryController,
  updateContryController,
  updateJourneyController,
  getAllJourneyController,
  createJourneyController,
} from "../admincontrollers/journeycountry.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import { upload } from "../adminutils/image.upload.mjs";
const router = express.Router();

//create countries for journey
router.post(
  "/country",
  [auth, isAdmin, upload.single("image")],
  createContryController
);

// get all countries list
router.get("/", [auth, isAdmin], getAllJourneyController);

//create journies for journey
router.post("/", [auth, isAdmin], createJourneyController);

//update journies for journey
router.post("/:journeyId", [auth, isAdmin], updateJourneyController);

// update countries
router.post(
  "/change_country/:countryId",
  [auth, isAdmin, upload.single("image")],
  updateContryController
);

export default router;
