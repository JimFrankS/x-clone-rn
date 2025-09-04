import { getAuth } from "@clerk/express";

export const protectRoute = (req, res, next) => {
    // Security best practice: Do not log sensitive auth info in production
    const { userId } = getAuth(req);
    if (!userId){ // Check if the user is authenticated using Clerk
        return res.status(401).json({ error: "Unauthorized - you must be logged in" }); // If not authenticated, return 401 status with message
    }
    next(); // If authenticated, proceed to the next middleware or route handler
};
