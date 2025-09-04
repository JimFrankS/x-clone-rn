import mongoose from "mongoose"; // Import mongoose for MongoDB connection
import { ENV } from "./env.js"; // Import environment variables

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB already connected");
            return;
        }
        await mongoose.connect(ENV.MONGO_URI, {
            connectTimeoutMS: 30000, // 30 seconds
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
        });
        console.log("MongoDB connected successfully ✅");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        // Don't exit in serverless - let the function handle the error
        throw error; // Re-throw to be handled by calling code
    }
}
