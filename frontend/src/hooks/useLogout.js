import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        try {
            setLoading(true);
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                localStorage.removeItem("chat-user");
                setAuthUser(null);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return { loading, logout };
}

export default useLogout;