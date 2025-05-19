// // import jwt from "jsonwebtoken";
// // import User from "../models/user.model.js";

// // export const protectRoute = async (req, res, next) => {
// //     try {
// //         const token = req.cookies.jwt;
        
// //         if (!token) {
// //             return res.status(401).json({
// //                 "message": "Unauthorized - No Token provided"
// //             });
// //         }
        
// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //         if (!decoded) {
// //             return res.status(401).json({
// //                 "message": "Unauthorized - Invalid token"
// //             });
// //         }

// //         const user = await User.findById(decoded.userId).select("-password");
        
// //         if (!user) {
// //             return res.status(401).json({
// //                 "message": "Unauthorized - User not found"
// //             });
// //         }
        
// //         req.user = user;
// //         next();
        
// //     } catch (error) {
// //     console.log("Error in sendMessage:", error.message, error.stack);
// //     res.status(500).json({
// //         "message": "Internal server error: " + error.message
// //     });
// // }
// // };

// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt;
        
//         if (!token) {
//             return res.status(401).json({
//                 "message": "Unauthorized - No Token provided"
//             });
//         }
        
//         // This could throw an error if token is invalid
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // This check is redundant since jwt.verify throws an error if invalid
//         // If we reach here, decoded is always valid
//         // if (!decoded) {
//         //    return res.status(401).json({
//         //        "message": "Unauthorized - Invalid token"
//         //    });
//         // }

//         const user = await User.findById(decoded.userId).select("-password");
        
//         if (!user) {
//             return res.status(401).json({
//                 "message": "Unauthorized - User not found"
//             });
//         }
        
//         req.user = user;
//         next();
        
//     } catch (error) {
//         // Fixed error message to reflect the correct function
//         console.log("Error in protectRoute middleware:", error.message);
        
//         // Different error handling based on error type
//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({
//                 "message": "Unauthorized - Invalid token"
//             });
//         } else if (error.name === "TokenExpiredError") {
//             return res.status(401).json({
//                 "message": "Unauthorized - Token expired"
//             });
//         }
        
//         res.status(500).json({
//             "message": "Internal server error"
//         });
//     }
// };

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                "message": "Unauthorized - No Token provided"
            });
        }
        
        // This could throw an error if token is invalid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user from decoded token
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({
                "message": "Unauthorized - User not found"
            });
        }
        
        // Add user to request object
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({
            "message": "Unauthorized - Invalid token"
        });
    }
};