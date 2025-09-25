import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "@/lib/apiClient";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticated] = useState(false);

    const loadUser = useCallback(async () => {
        try {
            const res = await apiFetch("/api/user/current", {}, {});
            setUser(res.user);
            console.log(res);
            return true;
        } catch (e) {
            console.error(e);
            setUser(null);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setAuthenticated(user?.type != "TEMP");
        }
    }, [user])

    useEffect(() => {

        loadUser();
        
    }, [loadUser]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser, loading, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};