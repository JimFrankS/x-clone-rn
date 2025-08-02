export const protectRoute = (req, res, next) => {
    if (!req.auth.user){ // Check if the user is authenticated using Clerk 
        return res.status(401).json({ message: "Unauthorized - you must be logged in" }); // If not authenticated, return 401 status with message
    }
    next(); // If authenticated, proceed to the next middleware or route handler
};