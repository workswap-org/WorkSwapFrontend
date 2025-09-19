// PrivateRoute.jsx
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import EmptyPage from "../pages/EmptyPage";
import { useEffect } from "react";

const PrivateRoute = () => {
    const { accessToken, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if (!accessToken) {
            const fullRedirect = `${window.location.origin}${location.pathname}`;
            navigate(`/login?redirect=${encodeURIComponent(fullRedirect)}`)
        }
    }, [accessToken, location.pathname, navigate])

    if (loading) {
        return <EmptyPage />; // или спиннер
    }

    return <Outlet />;
};
export default PrivateRoute;