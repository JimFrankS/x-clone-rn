import asyncHandler from "express-async-handler"; // Import asyncHandler to handle asynchronous route handlers, which helps in catching errors and passing them to the error handler
import mongoose from "mongoose"; // Import mongoose to interact with MongoDB and perform database operations 
import User from "../models/user.model.js"; // Import the User model to interact with user data in the database
import Notification from "../models/notification.model.js"; // Import the Notification model to handle user notifications
import { clerkClient, getAuth } from "@clerk/express"; // Import Clerk client and getAuth function to manage user authentication and data retrieval from Clerk

export const getUserProfile = asyncHandler(async(req, res) => {
    const { username } = req.params; // Extract the username from the request parameters
    const user = await User.findOne({ username }).select("-password -__v"); // Find the user by username, excluding password and version fields
    if (!user)  return res.status(404).json({ error: "User not found" }); // If user not found, return 404 status with message
    res.status(200).json(user); // If user found, return 200 status with
});


export const updateProfile = asyncHandler (async (req, res) => {
    const {userId} = getAuth(req); // Get the authenticated user's ID from the request

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized - invalid user ID" });
    }

    // Validate and sanitize allowed fields
    const allowedFields = ['firstName', 'lastName', 'profilePicture', 'bio'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            const val = req.body[key];
            updateData[key] = typeof val === "string" ? val.trim() : val;
        }
    });

    const user = await User.findOneAndUpdate({ clerkId: userId}, updateData, {new: true}); // Find the user by Clerk ID and update their profile with the sanitized data
    if (!user) return res.status(404).json({ error: "User not found" }); // If user not found, return 404 status with message
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
    const { userId } = getAuth(req); // Get the authenticated user's ID from the request

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized - invalid user ID" });
    }

    const existingUser = await User.findOne({ clerkId: userId }); // Check if a user with the given Clerk ID already exists in the database
    if (existingUser) {
        return res.status(200).json({ user: existingUser, message: "User already exists" }); // If user exists, return 200 status with the existing user data and a message
    }

    let clerkUser;
    try {
        clerkUser = await clerkClient.users.getUser(userId); // Create a new user in the database using the authenticated user's Clerk ID and other details
    } catch (error) {
        console.error("Error fetching user from Clerk:", error);
        return res.status(500).json({ error: "Failed to fetch user data from Clerk" });
    }

    // Safely extract email and generate username
    const primaryEmailObj =
        clerkUser.emailAddresses?.find(e => e.id === clerkUser.primaryEmailAddressId)
        ?? clerkUser.emailAddresses?.[0];
    const primaryEmail = primaryEmailObj?.emailAddress ?? null;

    const baseUsername = primaryEmail
        ? primaryEmail.split("@")[0]
        : `user${Date.now()}`; // Fallback username with timestamp

    // Validate and trim required fields
    const trimmedFirstName = clerkUser.firstName?.trim();
    const trimmedLastName = clerkUser.lastName?.trim();

    if (!trimmedFirstName || !trimmedLastName) {
        return res.status(400).json({ error: "Invalid user data from Clerk" });
    }

    const userData = {
        clerkId: userId, // Store the Clerk ID
        email: primaryEmail || "", // Store the user's email address
        firstName: trimmedFirstName, // Store the user's first name, trimmed
        lastName: trimmedLastName, // Store the user's last name, trimmed
        username: await generateUniqueUsername(baseUsername), // Generate a unique username from the email address or fallback
        profilePicture: clerkUser.profileImageUrl || "", // Store the user's profile picture URL, defaulting to an empty string if not available
    };

    let user;
    try {
        user = await User.create(userData); // Create a new user in the database with the userData object
    } catch (error) {
        // Handle duplicate key error for username
        if (error.code === 11000 && error.keyPattern?.username) {
            // Retry with a new username
            const retryUsername = await generateUniqueUsername(`${baseUsername}_retry`);
            userData.username = retryUsername;
            try {
                user = await User.create(userData);
            } catch (retryError) {
                console.error("Error creating user in database after retry:", retryError);
                return res.status(500).json({ error: "Failed to create user in database" });
            }
        } else {
            console.error("Error creating user in database:", error);
            return res.status(500).json({ error: "Failed to create user in database" });
        }
    }

    res.status(201).json({ user, message: "User created successfully" }); // Return 201 status with the newly created user data and a success message

});

export const getCurrentUser = asyncHandler( async (req, res) => {
    const { userId } = getAuth(req); // Get the authenticated user's ID from the request

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized - invalid user ID" });
    }

    const user = await User.findOne({ clerkId: userId }).select("-password -__v"); // Find the user by Clerk ID, excluding password and version fields
    if (!user) return res.status(404).json({ error: "User not found" }); // If user not found, return 404 status with message

    res.status(200).json(user); // If user found, return 200 status with the user data

});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req); // Get the authenticated user's ID from the request
  const { targetUserId } = req.params; // Extract the target user's ID from the request parameters

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - invalid user ID" });
  }

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" }); // Prevent the user from following themselves

  // Find both the current user and the target user in the database
  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

  // Check if the current user is already following the target user
  const isFollowing = currentUser.following.includes(targetUserId);

  const session = await mongoose.startSession(); // Start a new session for transaction handling which allows us to ensure atomicity
  session.startTransaction(); // Start a transaction to ensure that both follow/unfollow actions and notification creation are atomic 
  try {
    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: targetUserId },
      }, { session });
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUser._id },
      }, { session });
    } else {
      // follow
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: targetUserId },
      }, { session });
      await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: currentUser._id },
      }, { session });

      // create notification
      await Notification.create([
        {
          from: currentUser._id,
          to: targetUserId,
          type: "follow",
        }
      ], { session });
    }
    await session.commitTransaction();
    res.status(200).json({
      message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
    });
  } catch (error) {
    await session.abortTransaction(); // If an error occurs, abort the transaction to ensure no partial updates
    throw error;
  } finally {
    session.endSession(); // End the session to free up resources
  }
});

