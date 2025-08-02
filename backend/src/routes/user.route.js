import express from "express"; // Import Express framework for easy routing and middleware handling
import { getUserProfile, updateProfile, syncUser, getCurrentUser, followUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router(); // Create a new router instance so we can define routes

router.get("/profile/:username", getUserProfile); // Route to get user profile (public), no authentication required

//Protected routes
router.post("/sync", protectRoute, syncUser); // Route to sync user data with Clerk, protected by authentication middleware
router.get("/me", protectRoute, getCurrentUser); // Route to get the current user's profile, protected by authentication middleware
router.put("/profile", protectRoute, updateProfile); // Route to update user profile, protected by authentication middleware
router.post("/follow/:targetUserId", protectRoute, followUser); // Route to follow a user, protected by authentication middleware


export default router; // Export the router so it can be used in other files