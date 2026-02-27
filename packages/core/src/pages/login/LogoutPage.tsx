import { useCallback, useEffect } from "react";
import { useAuth } from "@core/lib";
import { apiFetchJson } from "@core/lib";
import { useNavigate } from "react-router-dom";
import { AUTH_BASE } from "@core/config";

const LogoutPage = () => {

    const navigate = useNavigate();

    const { loadUser } = useAuth();

    const logout = useCallback(async () => {
        try {
            await fetch(AUTH_BASE + "/api/auth/logout", { method: "POST", credentials: "include", });
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
        <></>
    );
};

export default LogoutPage;