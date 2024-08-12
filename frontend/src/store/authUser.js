import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import Cookies from 'js-cookie';  // Import js-cookie

const BASE_URL = import.meta.env.VITE_URL


export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			const response = await axios.post(BASE_URL + "/api/v1/auth/signup", credentials);
			if (response.data.token) {
				Cookies.set('jwt-netflix', response.data.token, { expires: 7 }); // Adjust expiration as needed
			}
			set({ user: response.data.user, isSigningUp: false });
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Signup failed");
			set({ isSigningUp: false, user: null });
		}
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await axios.post(BASE_URL + "/api/v1/auth/login", credentials);

			// Set the token in cookies
			if (response.data.token) {
				Cookies.set('jwt-netflix', response.data.token, { expires: 7 }); // Adjust expiration as needed
			}

			set({ user: response.data.user, isLoggingIn: false });
		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await axios.post(BASE_URL + "/api/v1/auth/logout");
			Cookies.remove('jwt-netflix'); // Remove the token from cookies
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const token = Cookies.get('jwt-netflix'); // Retrieve token from cookies
			if (token) {
				const response = await axios.post(BASE_URL + "/api/v1/auth/authCheck", {
					headers: { 'Authorization': `Bearer ${token}` },
					withCredentials: true,
				});
				set({ user: response.data.user, isCheckingAuth: false });
			} else {
				set({ isCheckingAuth: false, user: null });
			}
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			// toast.error(error.response.data.message || "An error occurred");
		}
	},
}));
