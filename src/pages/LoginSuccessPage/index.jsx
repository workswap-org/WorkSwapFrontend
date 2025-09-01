// LoginSuccessPage.jsx
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "@/api/config";
import { apiFetch } from "@/lib/apiClient";

const LoginSuccessPage = () => {
    const { setUser, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            setAccessToken(data.accessToken);
            const res = apiFetch(`/api/user/current`);
            return res.user;
        })
        .then(user => {
            setUser(user);

            // 3️⃣ После успешной загрузки юзера — редирект туда, откуда пришёл
            const from = new URLSearchParams(location.search).get("redirect") || "/";
            navigate(from, { replace: true });
        })
        .catch(err => console.error("Auth failed:", err));
    }, [setAccessToken, setUser, navigate, location.search]);

    return <div>Загрузка...</div>;
};

export default LoginSuccessPage;