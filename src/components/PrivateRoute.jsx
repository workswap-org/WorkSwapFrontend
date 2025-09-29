// PrivateRoute.jsx
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import EmptyPage from "../pages/EmptyPage";
import { useEffect } from "react";

const PrivateRoute = () => {
    const { loading, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        console.log("loading", loading);
        console.log("isAuthenticated", isAuthenticated);

        if (!isAuthenticated && !loading) {
            console.log("Редиректим на логин");
            const fullRedirect = `${window.location.origin}${location.pathname}`;
            navigate(`/login?redirect=${encodeURIComponent(fullRedirect)}`)
        }
    }, [isAuthenticated, loading, location.pathname, navigate])

    if (loading) {
        return <EmptyPage />; // или спиннер
    }

    return <Outlet />;
};

export default PrivateRoute;