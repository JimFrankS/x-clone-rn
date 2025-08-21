// multer is a middleware for handling  multipart/form-data, which is commonly used for file uploads.

import multer from "multer"; // Import multer for handling file uploads

const storage = multer.memoryStorage(); // Use memory storage to store files in memory

const fileFilter = (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith("image/")) { // Check if the file is an image
        cb(new Error("Only image files are allowed"), false); // Reject the file with an error message and false
    } else {
        cb(null, true); // Accept the file
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
 }); // Create multer instance with memory storage and file filter

export default upload; // Export the multer instance for use in other files