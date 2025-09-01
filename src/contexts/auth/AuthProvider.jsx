import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "@/lib/apiClient";

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await apiFetch("/api/user/current");
                setUser(await res.user);
                setAccessToken(localStorage.getItem("accessToken")); // если есть в localStorage
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    useEffect(() => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        else localStorage.removeItem("accessToken");
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};