import express from "express"
import { ENV } from "./config/env.js"; // Import environment variables
import { connectDB } from "./config/db.js"; // Import database connection function

const app = express();

connectDB(); // Connect to the MongoDB database

app.get("/", (req, res) => res.send("Hello from server")) // Simple route to test server

app.listen(ENV.PORT, () => console.log("Server is running on port", ENV.PORT)); // Start the server on the specified port