import asyncHandler from "express-async-handler"; // Import asyncHandler to handle asynchronous route handlers, which helps in catching errors and passing them to the error handler
import User from "../models/user.model.js"; // Import the User model to interact with user data in the database
import Notification from "../models/notification.model.js"; // Import the Notification model to handle user notifications
import { clerkClient, getAuth } from "@clerk/express"; // Import Clerk client and getAuth function to manage user authentication and data retrieval from Clerk

export const getUserProfile = asyncHandler(async(req, res) => {
    const { username } = req.params; // Extract the username from the request parameters
    const user = await User.findOne({ username }).select("-password -__v"); // Find the user by username, excluding password and version fields
    if (!user)  return res.status(404).json({ message: "User not found" }); // If user not found, return 404 status with message
    res.status(200).json(user); // If user found, return 200 status with
});


export const updateProfile = asyncHandler (async (req, res) => {
    const {userID} = getAuth(req); // Get the authenticated user's ID from the request

    // Validate and sanitize allowed fields
    const allowedFields = ['firstname', 'lastname', 'profilePicture', 'bio'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            updateData[key] = req.body[key];
        }
    });

    const user = await User.findOneAndUpdate({ clerkId: userID}, updateData, {new: true}); // Find the user by Clerk ID and update their profile with the sanitized data
    if (!user) return res.status(404).json({ message: "User not found" }); // If user not found, return 404 status with message
    res.status(200).json({user}); // If user found, return 200 status with the updated user data
});

// Helper to generate a unique username based on a base username
async function generateUniqueUsername(baseUsername) {
    let username = baseUsername;
    let counter = 0;
    while (await User.findOne({ username })) {
        counter++;
        username = `${baseUsername}${counter}`;
    }
    return username;
}

export const syncUser = asyncHandler (async (req, res) => {

    const { userID } = getAuth(req); // Get the authenticated user's ID from the request

    const existingUser = await User.findOne({ clerkId: userID }); // Check if a user with the given Clerk ID already exists in the database
    if (existingUser) {
        return res.status(200).json({ user: existingUser, message: "User already exists" }); // If user exists, return 200 status with the existing user data and a message
    } 

    const clerkUser = await clerkClient.users.getUser(userID); // Create a new user in the database using the authenticated user's Clerk ID and other details

    const userData = {
        clerkId: userID, // Store the Clerk ID
        email: clerkUser.emailAddresses[0].emailAddress, // Store the user's email address
        firstname: clerkUser.firstName || "", // Store the user's first name, defaulting to an empty string if not available
        lastname: clerkUser.lastName || "", // Store the user's last name, defaulting to an empty string if not available
        username: await generateUniqueUsername(clerkUser.emailAddresses[0].emailAddress.split("@")[0]), // Generate a unique username from the email address
        profilePicture: clerkUser.profileImageUrl || "", // Store the user's profile picture URL, defaulting to an empty string if not available
    };

    const user = await User.create(userData); // Create a new user in the database with the userData object
    res.status(201).json({ user, message: "User created successfully" }); // Return 201 status with the newly created user data and a success message

});

export const getCurrentUser = asyncHandler( async (req, res) => {
    const { userID } = getAuth(req); // Get the authenticated user's ID from the request
    const user = await User.findOne({ clerkId: userID }).select("-password -__v"); // Find the user by Clerk ID, excluding password and version fields
    if (!user) return res.status(404).json({ message: "User not found" }); // If user not found, return 404 status with message

    res.status(200).json(user); // If user found, return 200 status with the user data

});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req); // Get the authenticated user's ID from the request
  const { targetUserId } = req.params; // Extract the target user's ID from the request parameters

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" }); // Prevent the user from following themselves

  // Find both the current user and the target user in the database

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

    // Check if the current user is already following the target user

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
  });
});

