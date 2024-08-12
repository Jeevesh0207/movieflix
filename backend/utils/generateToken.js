import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

	// res.cookie("jwt-netflix", token, {
	// 	maxAge: 15 * 24 * 60 * 60 * 1000,
	// 	httpOnly: true, 
	// 	sameSite: 'None',
	// 	secure: true,
	// });

	res.cookie('jwt-netflix', token, {
		httpOnly: true, // Makes cookie inaccessible to JavaScript
		secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS
		sameSite: 'strict', // Controls whether cookies are sent with cross-site requests
	});

	return {
		ok: true,
		token,
	}
};