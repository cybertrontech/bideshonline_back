import express from "express"
import { createUserController, getAllUsersController,getUserTypeController } from "../controllers/user.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { isAdmin } from "../middleware/admin.mjs";
const router=express.Router();

  
// Get all users
router.get('/',[auth,isAdmin], getAllUsersController);

// Create a new user
router.post('/',createUserController );
  
// a  user type
router.get('/user_type',auth,getUserTypeController );
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

  export default router