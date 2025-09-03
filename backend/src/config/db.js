import mongoose from "mongoose"; // Import mongoose for MongoDB connection
import { ENV } from "./env.js"; // Import environment variables

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI) // Connect to MongoDB using the URI from environment variables
        console.log("MongoDB connected successfully ✅"); // Log success message if connection is successful
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message); // Log error message if connection fails
       // process.exit(1); // Exit the process if connection fails
    }
}
