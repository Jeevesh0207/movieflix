import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		// Assuming req is properly defined as an HTTP request object
		const headers = req.headers;
		// Check if headers and authorization exist to avoid null pointer exceptions
		if (headers && headers.authorization) {
			// Extract the token, considering the standard Authorization header format
			const authHeader = headers.authorization;
			const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer your_token"
			if (!token) {
				return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
			}
			const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

			if (!decoded) {
				return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
			}

			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				return res.status(404).json({ success: false, message: "User not found" });
			}
			req.user = user;

			next();
		} else {
			console.log("Authorization header is missing or empty.");
		}

	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ success: false, message: "Unauthorized - Token Expired" });
		}

		res.status(500).json({ success: false, message: error.message });

	}
};
