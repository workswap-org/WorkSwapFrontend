import { useCallback, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { apiFetch } from "@/lib/services/apiClient";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {

    const navigate = useNavigate();

    const { loadUser } = useAuth();

    const logout = useCallback(async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            navigate("/");
            loadUser();
        }
    }, [navigate, loadUser]);

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