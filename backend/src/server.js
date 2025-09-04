import express from "express"; // Import Express framework for building web applications
import cors from "cors"; // Import CORS middleware for handling cross-origin requests
import mongoose from "mongoose"; // Import mongoose for database connection check
import {clerkMiddleware} from "@clerk/express"; // Import Clerk middleware for authentication

import userRoutes from "./routes/user.route.js"; // Import user routes from user.route.js
import postRoutes from "./routes/post.route.js"; // Import post routes from post.route.js
import commentRoutes from "./routes/comment.route.js"; // Import comment routes from comment.route.js
import notificationRoutes from "./routes/notification.route.js"; // Import notification routes from notification.route.js


import { ENV } from "./config/env.js"; // Import environment variables
import { connectDB } from "./config/db.js"; // Import database connection function
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";


const app = express(); // Create an instance of Express application

app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON request bodies

app.use(clerkMiddleware()); // Use Clerk middleware for authentication

// Middleware to connect to database if not connected
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});

// app.use(arcjetMiddleware); // Use Arcjet middleware for security features - disabled

app.get("/", (req, res) => res.send("Hello from server")) // Simple route to test server

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes)
app.use("/api/notifications", notificationRoutes); 


//error handling middleware

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err); // Log the error to the console
    res.status(500).json({ error: err.message ||"Internal Server Error" }); // Send a 500 Internal Server Error response with the error message

    next(); // Call the next middleware in the stack
})

const startServer = async () => {
    try {
        await connectDB(); // Connect to the database
        console.log("Database connected");

          if (ENV.NODE_ENV !== "production") { 
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT)); // Start the server on the specified port if not in production

    }

    } catch (error) {
        console.error("Error starting server:", error); // Log any errors that occur during server startup
        process.exit(1); // Exit the process with a failure code
    }
};

startServer(); // Call the function to start the server

export default app; // Export the Express application instance for use in vercel
