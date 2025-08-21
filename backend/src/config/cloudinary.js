import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary SDK
import {ENV} from './env.js'; // Import environment variables

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME, // Set Cloudinary cloud name
    api_key: ENV.CLOUDINARY_API_KEY, // Set Cloudinary API key
    api_secret: ENV.CLOUDINARY_API_SECRET, // Set Cloudinary API secret
});

export default cloudinary; // Export the configured Cloudinary instance for use in other parts of the application