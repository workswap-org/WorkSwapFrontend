import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            const res = await apiFetch("/api/user/current");
            setUser(res.user);
            setAccessToken(localStorage.getItem("accessToken"));
        } catch (e) {
            console.error(e);
            setUser(null);
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    }, []); // нет зависимостей → всегда одна и та же ссылка

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        else localStorage.removeItem("accessToken");
    }, [accessToken]);

    const logout = async () => {
        try {
            navigate('/catalog');
            await apiFetch("/api/auth/logout", { method: "POST" }); // запрос на сервер
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            setAccessToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, loading, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};