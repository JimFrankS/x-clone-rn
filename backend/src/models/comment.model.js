import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // User who made the comment
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        }, // Reference to the post being commented on
        content: {
            type: String,
            required: true,
            maxLength: 280, 
        }, // Content of the comment
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }], // Users who liked the comment
    },
    {timestamps: true},
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;