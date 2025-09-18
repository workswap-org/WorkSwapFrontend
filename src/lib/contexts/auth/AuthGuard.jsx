import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"; // твой хук авторизации

export default function AuthGuard() {
    const { user } = useAuth();

    if (user && user?.status == "PENDING") {
        return <Navigate to="/register" replace />;
    }

    return <Outlet />;
}