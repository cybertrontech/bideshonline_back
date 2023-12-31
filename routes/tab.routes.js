import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../middleware/auth.mjs";
import { Tabs } from "../models/Tabs.mjs";
import { Content } from "../models/Content.mjs";
import { Journery } from "../models/Journey.mjs";
import { Language } from "../models/Language.mjs";
import mongoose from "mongoose";
import { CustomError } from "../error/CustomError.mjs";
import { User } from "../models/User.mjs";
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// get all tabs list
router.get("/", auth, async (req, res, next) => {
  try {
    // const tabs = await Tabs.find({ active: true }).select("-__v -active");
    const user = await User.findById(req.user.userId);
    if (user === null) {
      return next(new CustomError(404, "User with this id doesn't exist."));
    }
    console.log(user.language);

    const cons = await Content.aggregate([
      {
        $lookup: {
          from: "journeries",
          localField: "journey",
          foreignField: "_id",
          as: "jor",
        },
      },
      {
        $unwind: "$jor",
      },
      {
        $addFields: {
          dest: "$jor.destination",
        },
      },
      {
        $lookup: {
          from: "destinationusers",
          let: { desti: "$dest" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", new ObjectId(req.user.userId)] },
                    { $eq: ["$destination", "$$desti"] },
                  ],
                },
              },
            },
          ],
          as: "destinations",
        },
      },
      {
        $addFields: {
          destLen: { $size: "$destinations" },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          journey: 1,
          tab: 1,
          dest: 1,
          d: 1,
          destLen: 1,
          background_image: 1,
        },
      },
    ]);

    const t = await Journery.populate(cons, {
      path: "journey",
      select: "_id origin",
    });

    const finalQuery = t.filter(
      (obj) =>
        obj.journey.origin.toString() === user.origin.toString() &&
        obj.destLen > 0
    );

    const tabs = await Tabs.aggregate([
      {
        $lookup: {
          from: "contents",
          localField: "_id",
          foreignField: "tab",
          as: "con",
        },
      },
      {
        $addFields: {
          contentCount: { $size: "$con" }, // Add a field with the count
        },
      },

      // {
      //   $lookup: {
      //     from: "languagewisetabs",
      //     localField: "_id",
      //     foreignField: "tab",
      //     as: "alternate",
      //   },
      // },
      {
        $lookup: {
          from: "languagewisetabs",
          let: { tabId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$tab", "$$tabId"], // Match on _id field from 'products' and 'productId' variable
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ["$language", new ObjectId(user.language)], // Match on _id field from 'products' and 'productId' variable
                },
              },
            },

            // Add more pipeline stages as needed to filter or transform the data
          ],
          as: "alternate",
        },
      },

      {
        $unwind: { path: "$alternate", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          "alternate._id": 0,
          "alternate.createdAt": 0,
          "alternate.updatedAt": 0,
          "alternate.__v": 0,
        },
      },
      {
        $addFields: {
          hasAlternate: {
            $cond: {
              if: { $isArray: "$alternate" },
              then: true,
              else: false,
            },
          },
        },
      },

      // {
      //   $match: {
      //     $or: [
      //       { hasAlternate: false }, // Retain documents without "alternate" field
      //       { "alternate.language": new ObjectId(user.language) }, // Match valid language ID
      //     ],
      //   },
      // },

      {
        $project: {
          hasAlternate: 0, // Remove the temporary field used for matching
          // contentCount:1
          con: 0,
        },
      },
      // {
      //   $match: {
      //     "alternate.language": new ObjectId("64aed0d17de756ca24eff40d"),
      //   },
      // },
    ]);
    return res.send({ recentContent: finalQuery, tabs });
  } catch (e) {
    return next(new Error());
  }
});

// get contents wise
router.get("/contents/:tabId/:destinationId", auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    // const tabs = await Content.aggregate([
    //   {
    //     $match: {
    //       tab: new ObjectId(req.params.tabId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "journeries",
    //       localField: "journey",
    //       foreignField: "_id",
    //       as: "jor",
    //     },
    //   },
    //   {
    //     $unwind: "$jor",
    //   },
    //   {
    //     $addFields: {
    //       dest: "$jor.destination",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "destinationusers",
    //       let: { desti: "$dest" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$user", new ObjectId(req.user.userId)] },
    //                 { $eq: ["$destination", "$$desti"] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "destinations",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       destLen: { $size: "$destinations" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       title: 1,
    //       journey: 1,
    //       tab: 1,
    //       dest: 1,
    //       d: 1,
    //       destLen: 1,
    //       background_image: 1,
    //     },
    //   },
    // ]);

    const tabs = await Content.aggregate([
      {
        $match: {
          tab: new ObjectId(req.params.tabId),
        },
      },
      {
        $lookup: {
          from: "journeries",
          localField: "journey",
          foreignField: "_id",
          as: "jor",
        },
      },
      {
        $unwind: "$jor",
      },
      {
        $addFields: {
          dest: "$jor.destination",
          orig: "$jor.origin",
        },
      },
      {
        $match: {
          $and: [
            {
              dest: new ObjectId(req.params.destinationId),
            },
            {
              orig: new ObjectId(user.origin),
            },
            {
              language:new ObjectId(user.language)
            }
          ],
        },
      },
      {
        $sort:{createdAt:-1}
      },
        {
        $project: {
          _id: 1,
          title: 1,
          tab: 1,
          background_image: 1,
          createdAt:1
        },
      },

      // {
      //   $lookup: {
      //     from: "destinationusers",
      //     let: { desti: "$dest" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$user", new ObjectId(req.user.userId)] },
      //               { $eq: ["$destination", "$$desti"] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "destinations",
      //   },
      // },
      // {
      //   $addFields: {
      //     destLen: { $size: "$destinations" },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     title: 1,
      //     journey: 1,
      //     tab: 1,
      //     dest: 1,
      //     d: 1,
      //     destLen: 1,
      //     background_image: 1,
      //   },
      // },
    ]);


    const t = await Journery.populate(tabs, {
      path: "journey",
      select: "_id origin",
    });

    return res.send(t);

    // const finalQuery = t.filter(
    //   (obj) =>
    //     obj.journey.origin.toString() === user.origin.toString() &&
    //     obj.destLen > 0
    // );

    // return res.send(finalQuery);
  } catch (e) {
    return next(new Error());
  }
});

// get content by tab id
// router.get(
//   "/:tabId/:originId/:destinationId/",
//   auth,
//   async (req, res, next) => {
//     try {
//       // const langId = req.params.languageId;
//       const { originId, destinationId } = req.params;

//       const journey = await Journery.findOne({
//         origin: originId,
//         destination: destinationId,
//       });

//       const user = await User.findById(req.user.userId);

//       if (user === null) {
//         return next(new CustomError(404, "User doesn't exist."));
//       }

//       if (journey === null) {
//         return next(new CustomError(404, "This content doesn't exist."));
//       }

//       if (user.language) {
//         const content = await Content.find({
//           tab: req.params.tabId,
//           journey,
//           language: user.language,
//         })
//           .populate({ path: "language", select: { name: 1 } })
//           .populate({
//             path: "creator",
//             select: { first_name: 1, last_name: 1, image: 1 },
//           })
//           .select("-__v -active");

//         //let the first content lang type be used in case the user.language is not present
//         if (content.length === 0) {
//           // return next(new CustomError(404, "This content doesn't exist."));
//         } else {
//           return res.send(content[0]);
//         }
//       }

//       const content = await Content.find({
//         tab: req.params.tabId,
//         journey,
//         // language:user.language
//       })
//         .populate({ path: "language", select: { name: 1 } })
//         .populate({
//           path: "creator",
//           select: { first_name: 1, last_name: 1, image: 1 },
//         })
//         .select("-__v -active");
//       //   const tabs = await Tabs.find({ active: true }).select("-__v -active");
//       if (content.length === 0) {
//         return next(new CustomError(404, "This content doesn't exist."));
//       }
//       return res.send(content[0]);
//     } catch (e) {
//       return next(new Error());
//     }
//   }
// );

router.get("/one-content/:contentId", auth, async (req, res, next) => {
  try {
    // const langId = req.params.languageId;
    // const { destinationId } = req.params;

    const user = await User.findById(req.user.userId);

    if (user === null) {
      return next(new CustomError(404, "User doesn't exist."));
    }

    // const journey = await Journery.findOne({
    //   origin: user.origin,
    //   destination: destinationId,
    // });

    // if (journey === null) {
    //   return next(new CustomError(404, "This content doesn't exist."));
    // }

    const content = await Content.findById(req.params.contentId).populate({
      path: "creator",
      select: { first_name: 1, last_name: 1, image: 1 },
    });

    // const content = await Content.find({
    //   tab: req.params.tabId,
    //   journey,
    //   // language:user.language
    // })
    //   .populate({ path: "language", select: { name: 1 } })
    //   .populate({
    //     path: "creator",
    //     select: { first_name: 1, last_name: 1, image: 1 },
    //   })
    //   .select("-__v -active");
    // //   const tabs = await Tabs.find({ active: true }).select("-__v -active");
    // if (content.length === 0) {
    //   return next(new CustomError(404, "This content doesn't exist."));
    // }
    return res.send(content);
  } catch (e) {
    return next(new Error());
  }
});

export default router;
