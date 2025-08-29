// PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";

const PrivateRoute = ({ children }) => {
    const { accessToken, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Пока идёт инициализация токена, можно показывать спиннер или null
        return null; 
    }


    if (!accessToken) {
        const fullRedirect = `${window.location.origin}${location.pathname}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(fullRedirect)}`} replace />;
    }

    return children;
};

export default PrivateRoute;