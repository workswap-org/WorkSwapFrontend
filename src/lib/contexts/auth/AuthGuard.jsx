import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // твой хук авторизации
import { useEffect } from "react";

export default function AuthGuard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user?.status == "PENDING") {
            navigate("/register", { replace: true });
        }
    }, [navigate, user])

    return <Outlet />;
}