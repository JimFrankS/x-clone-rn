import asyncHandler from "express-async-handler"; // Import express-async-handler to handle asynchronous requests
import Post from "../models/post.model.js"; // Import Post model to interact with the database
import User from "../models/user.model.js"; // Import User model to interact with user data
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration for image uploads
import Notification from "../models/notification.model.js"; // Import Notification model to handle notifications
import Comment from "../models/comment.model.js"; // Import Comment model to handle comments on posts


export const getPosts = asyncHandler (async (req, res) => {
    const posts = await Post.find()
    .sort({ createdAt: -1 }) // Sort posts by creation date in descending order
    .populate("user", "username firstName lastName profilePicture") // Populate user details for each post
    .populate({
        path: "comments",
        populate: {
            path: "user",
            select: "username firstName lastName profilePicture" // Populate user details for comments
        },
    });

    res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.status(200).json({ post });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req); // Get the authenticated user's ID from Clerk
  const { content  } = req.body; // Get the post content from the request body
  const imageFile = req.file; // Get the uploaded image file from the request

  if (!content && !imageFile) {
    return res.status(400).json({ error: "Post must contain either text or an image" }); // Return an error if neither content nor image is provided
  }

  const user = await User.findOne({clerkId: userId}); // Find the user by Clerk ID
  if (!user) return res.status(404).json({ error: "User not found" }); // Return an error if the user is not found

  let imageUrl = "";
  if (imageFile) {
    try {
      //convert buffer to base64 for cloudinary upload
      const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "social_media_posts", // Specify the folder in Cloudinary
        resource_type: "image", // Specify the resource type as image
        transformation: [
          { width: 800, height: 600, crop: "limit" }, // Resize the image to a maximum of 800x600 pixels
          {quality: "auto"}, // Automatically adjust the quality of the image
          {format: "auto"} // Automatically adjust the format of the image
        ],
      });

      imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError); // Log any errors that occur during image upload
      return res.status(400).json({ error: "Failed to upload image" }); // Return an error if the image upload fails
    }
  }

  const post = await Post.create ({
    user: user._id, // Set the user ID for the post
    content: content || "", // Set the post content, defaulting to an empty string if not provided
    image: imageUrl, // Set the image URL if an image was uploaded
  });

  res.status(201).json({ post }); // Return the created post with a 201 status code

});

export const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params; // Get the post ID from the request parameters
  const { userId } = getAuth(req); // Get the authenticated user's ID from Clerk

  const user = await User.findOne({ clerkId: userId }); // Find the user by Clerk ID
  const post = await Post.findById(postId); // Find the post by ID

  if ( !user || !post) return res.status(404).json({ error: "User or Post not found" });  // Return an error if the user or post is not found

    const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    // unlike
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id }, // Remove the user's ID from the likes array
    });
  } else {
    // like
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id }, // Add the user's ID to the likes array
    });

    // create notification if not liking own post
    if (post.user.toString() !== user._id.toString()) { // Check if the user is not liking their own post
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }

  res.status(200).json({
    message: isLiked ? "Post unliked successfully" : "Post liked successfully",
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) return res.status(404).json({ error: "User or post not found" });

  if (post.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "You can only delete your own posts" });
  }

  // delete all comments on this post
  await Comment.deleteMany({ post: postId });

  // delete the post
  await Post.findByIdAndDelete(postId);

  res.status(200).json({ error: "Post deleted successfully" });
});