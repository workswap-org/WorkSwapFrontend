// LoginSuccessPage.jsx
import { useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "@/api/config";

const LoginSuccessPage = () => {
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            setAccessToken(data.accessToken);

            const from = new URLSearchParams(location.search).get("redirect") || "/";
            console.log("from ", from);
            navigate(from, { replace: true })
        })
        .catch(err => console.error("Auth failed:", err));
    }, [setAccessToken, navigate, location.search]);

    return <></>;
};

export default LoginSuccessPage;