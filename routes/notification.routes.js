import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Types } from "mongoose";
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import { CustomError } from "../error/CustomError.mjs";
import { Notification } from "../models/Notification.mjs";
import { User } from "../models/User.mjs";
import { sendNotificationAtBulk } from "../utils/notificationSender.mjs";
const router = express.Router();

// get all countries list
router.get("/", auth, async (req, res, next) => {
  try {
    const noti = await Notification.find({ user: req.user.userId })
      .populate({
        path: "content",
        select: "_id tab creator title",
        populate: {
          path: "creator tab",
          select: "_id title first_name last_name image",
        },
      })
      sort("-createdAt")
      .select("-user -__v");
    return res.send(noti);
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});

// get all push notifications list
router.get("/push", [auth, isAdmin], async (req, res, next) => {
  try {
    const noti = await Notification.find({ type: "push" }).sort("-createdAt");
    return res.send(noti);
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});

router.post("/push", [auth, isAdmin], async (req, res, next) => {
  try {
    const { title, body } = req.body;

    const fmwTokens = [];
    const noti = new Notification({
      title,
      body,
      type: "push",
    });
    const users = await User.find({ userType: "admin" });

    for (let i = 0; i < users.length; i++) {
      if (
        users[i]?.user?.deviceId !== undefined &&
        users[i]?.user?.deviceId !== null
      ) {
        fmwTokens.push(users[i].deviceId);
      }
    }

    try {
      if (fmwTokens.length > 0) {
        await sendNotificationAtBulk(fmwTokens, title, body);
      }
      await noti.save();
      return res.send({ message: "Push notification sent." });
    } catch (e) {
      // console.log(e);
      return next(new CustomError(500, "Something went wrong."));
    }
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { contentId } = req.body;
    const noti = new Notification({
      content: contentId,
      user: req.user.userId,
    });
    await noti.save();
    return res.send({ message: "Sucessfully created notification." });
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});

//update notification
router.put("/:notiId", auth, async (req, res, next) => {
  try {
    const notificataion = await Notification.findById(req.params.notiId);

    if (notificataion === null) {
      return next(
        new CustomError(404, "Notification with this id doesn't exist..")
      );
    }
    const notificatoniUser = notificataion.user;
    const userId = new Types.ObjectId(req.user.userId);

    if (notificatoniUser.toString() === userId.toString()) {
      notificataion.seen = true;
      await notificataion.save();
      return res.send({ message: "Viewed." });
    }

    return next(new CustomError(404, "You cannot't view this notification."));
  } catch (e) {
    return next(new CustomError(500, "Something went wrong."));
  }
});
export default router;
