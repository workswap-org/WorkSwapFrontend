// LoginSuccessPage.jsx
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "@/api/config";

const LoginSuccessPage = () => {
    const { loadUser, setAccessToken } = useAuth();
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

            loadUser();
            const from = new URLSearchParams(location.search).get("redirect") || "/";
            window.location.href = from;
        })
        .catch(err => console.error("Auth failed:", err));
    }, [setAccessToken, loadUser, navigate, location.search]);

    return <div>Загрузка...</div>;
};

export default LoginSuccessPage;