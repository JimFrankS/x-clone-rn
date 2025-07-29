import dotenv from "dotenv" // Import dotenv to load environment variables

dotenv.config(); // Load environment variables from .env file

export const ENV = {
    PORT: process.env.PORT, // Get port from environment variable
    NODE_ENV: process.env.NODE_ENV, // Get the environment (development, production, etc.)
    MONGO_URI: process.env.MONGO_URI, // MongoDB connection URI
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY, // Clerk publishable key for authentication
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY, // Clerk secret key for server-side operations
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name for media storage
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY, // Cloudinary API key for media operations
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret for secure operations
    ARCJET_KEY: process.env.ARCJET_KEY, // Arcjet key for security features
};