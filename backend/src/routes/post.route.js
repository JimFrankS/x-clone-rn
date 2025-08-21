import express from "express"; // Import express framework to handle routing 
import { getPosts, getPost, getUserPosts, createPost, likePost, deletePost } from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router(); // Create a new router instance

// public routes, no authentication required

router.get("/", getPosts); // Route to get all posts
router.get("/:postId", getPost); // Route to get a specific post by ID
router.get("/user/:username", getUserPosts); // Route to get posts by a specific user

// Protected Routes

router.post("/", protectRoute, upload.single("image"), createPost); // Route to create a new post, protected by authentication middleware and file upload middleware, image upload is optional
router.post("/:postId/like", protectRoute, likePost); // Route to like a post, protected by authentication middleware
router.delete("/:postId", protectRoute, deletePost); // Route to delete a post, protected by authentication middleware


export default router; // Export the router for use in other files