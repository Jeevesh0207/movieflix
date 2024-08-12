import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		console.log("Cookies:", req.cookies);
		const token = req.cookies["jwt-netflix"];
		console.log("Token:", token);
		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}
		console.log(token)
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
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ success: false, message: "Unauthorized - Token Expired" });
		}

		res.status(500).json({ success: false, message: error.message });

	}
};
