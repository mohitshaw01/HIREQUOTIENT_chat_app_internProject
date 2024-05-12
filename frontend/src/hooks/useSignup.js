import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username,email, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username,email, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender,email }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
      		console.log(data);
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username,email, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender || !email) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 3) {
		toast.error("Password must be at least 3 characters");
		return false;
	}

	return true;
}