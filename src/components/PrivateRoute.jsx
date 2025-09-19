// PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import EmptyPage from "../pages/EmptyPage";
import { useEffect } from "react";

const PrivateRoute = () => {
    const { accessToken, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {

        if (loading) {
            return <EmptyPage />; // или спиннер
        }

        if (!accessToken) {
            const fullRedirect = `${window.location.origin}${location.pathname}`;
            return <Navigate to={`/login?redirect=${encodeURIComponent(fullRedirect)}`} replace />;
        }
    }, [accessToken, loading, location.pathname])

    return <Outlet />;
};

export default PrivateRoute;