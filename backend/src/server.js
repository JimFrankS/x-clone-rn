import express from "express"
import { ENV } from "./config/env.js"; // Import environment variables
import { connectDB } from "./config/db.js"; // Import database connection function

const app = express();

app.get("/", (req, res) => res.send("Hello from server")) // Simple route to test server

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