import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkId: { 
            type: String,
            required: true,
            unique: true // Ensure that clerkId is unique across users
        },
        email: {
            type: String,
            required: true,
            unique: true // Ensure that email is unique across users
        },
        firstName: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true // Ensure that username is unique across users
        },
        profilePicture: {
            type: String,
            default: "" // Default to an empty string if no profile picture is provided
        },
        bannerImage: {
            type: String,
            default: "" 
        },
        bio: {
            type: String,
            default: "" ,
            maxLength: 160 // Limit bio to a maximum of 160 characters
        },

        location: {
            type: String,
            default: "" 
        },

        followers: [
           {
             type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing User model
            ref: "User", // Reference to User model for followers
           },
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema); // Create User model based on the schema
export default User; // Export the User model for use in other parts of the application