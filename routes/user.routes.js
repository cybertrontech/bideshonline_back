import express from "express";
import {
  createUserController,
  editUserController,
  getUserByIdController,
  editFrontUserWithImageController,
  editFrontUserController,
  editUserStatusController,
  createUserControllerByAdmin,
  createUserControllerGoogle,
  forgotPassword,
  getAllUsersController,
  getUserTypeController,
  editFrontUserAdvanceController,
  getUserByTokenAdminController,
  editUserByTokenAdminController,
  newPassword,
  resetPassword
} from "../controllers/user.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
import {upload} from "../adminutils/image.upload.mjs";
import { isAdminOrCreator } from "../middleware/adminorcontent.mjs";
const router = express.Router();

// a  user type
router.get("/user_type", auth, getUserTypeController);

// a  user by id 
router.get("/one_user/:userId", [auth], getUserByIdController);

// a  user by id  for admin
router.get("/adminInfo", [auth,isAdminOrCreator], getUserByTokenAdminController);

// a  edit user by id  for admin
router.post("/editadminInfo", [auth,isAdminOrCreator], editUserByTokenAdminController);



// Get all users
router.get("/:userType", [auth, isAdmin], getAllUsersController);

//update user without image
router.put("/edituser", [auth], editFrontUserController);

//update user with image
router.put("/edituser-image", [auth,upload.single("image")], editFrontUserWithImageController);


//update user advance 
router.put("/advance-edituser", [auth], editFrontUserAdvanceController);

// edit users by admin
router.put("/:userId", [auth, isAdmin], editUserController);

// edit users status by admin
router.get("/user-status/:userId", [auth, isAdmin], editUserStatusController);

// Create a new user
router.post("/", createUserController);

// Create a new user google
router.post("/google", createUserControllerGoogle);

// Create a new user
router.post("/by-admin", createUserControllerByAdmin);

router.post("/forgot-password",forgotPassword);

router.post("/new-password",newPassword)

router.post("/reset-password",auth,resetPassword)

// // Get a specific user by ID
// router.get('/users/:id', (req, res) => {
//   const userId = req.params.id;

//   User.findById(userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.status(200).json(user);
//     })
//     .catch(error => {
//       res.status(500).json({ error: error.message });
//     });
// });

// // Update a user
// router.put('/users/:id', (req, res) => {
//   const userId = req.params.id;
//   const { first_name, last_name, email, password, userType, deviceId } = req.body;

//   User.findByIdAndUpdate(userId, {
//     first_name,
//     last_name,
//     email,
//     password,
//     userType,
//     deviceId
//   }, { new: true })
//     .then(updatedUser => {
//       if (!updatedUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.status(200).json(updatedUser);
//     })
//     .catch(error => {
//       res.status(500).json({ error: error.message });
//     });
// });

// // Delete a user
// router.delete('/users/:id', (req, res) => {
//   const userId = req.params.id;

//   User.findByIdAndDelete(userId)
//     .then(deletedUser => {
//       if (!deletedUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.status(200).json({ message: 'User deleted successfully' });
//     })
//     .catch(error => {
//       res.status(500).json({ error: error.message });
//     });
// });

export default router;
