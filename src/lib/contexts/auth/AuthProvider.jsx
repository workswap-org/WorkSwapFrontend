import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "@/lib/apiClient";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticated] = useState(false);

    const loadUser = useCallback(async () => {
        try {
            setTimeout(async() => {
                const res = await apiFetch("/api/user/current", {}, {}, setAuthenticated);
                setUser(res.user);
            }, 0)
        } catch (e) {
            console.error(e);
            setUser(null);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {

        loadUser();
        
    }, [loadUser]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser, loading, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};