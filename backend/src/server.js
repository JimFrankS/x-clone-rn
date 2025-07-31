import express from "express"; // Import Express framework for building web applications
import cors from "cors"; // Import CORS middleware for handling cross-origin requests
import {clerkMiddleware} from "@clerk/express"; // Import Clerk middleware for authentication

import userRoutes from "./routes/user.route.js"; // Import user routes from user.route.js


import { ENV } from "./config/env.js"; // Import environment variables
import { connectDB } from "./config/db.js"; // Import database connection function


const app = express(); // Create an instance of Express application

app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON request bodies

app.use(clerkMiddleware()); // Use Clerk middleware for authentication

app.get("/", (req, res) => res.send("Hello from server")) // Simple route to test server

app.use("/api/users", userRoutes);


const startServer = async () => {
    try {
        await connectDB(); // Connect to the database

        app.listen(ENV.PORT, () => console.log("Server is running on port", ENV.PORT)); // Start the server on the specified port

    } catch (error) {
        console.error("Error starting server:", error); // Log any errors that occur during server startup
        process.exit(1); // Exit the process with a failure code
    }
};

startServer(); // Call the function to start the server