import { useCallback, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { apiFetch } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const logout = useCallback(async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            navigate("/");
            setUser(null);
        }
    }, [navigate, setUser]);

    useEffect(() => {
        logout()
    }, [logout])
    
    return (
        <>
            {/* LogoutPage component */}
        </>
    );
};

export default LogoutPage;