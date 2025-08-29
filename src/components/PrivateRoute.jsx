// PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import EmptyPage from "../pages/EmptyPage";

const PrivateRoute = () => {
    const { accessToken, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <EmptyPage />; // или спиннер
    }

    if (!accessToken) {
        const fullRedirect = `${window.location.origin}${location.pathname}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(fullRedirect)}`} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;