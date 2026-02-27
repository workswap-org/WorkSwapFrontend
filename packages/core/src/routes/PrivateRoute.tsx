// PrivateRoute.jsx
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@core/lib";
import EmptyPage from "@core/pages/EmptyPage";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
    const { loading, isAuthenticated } = useAuth();
    const location = useLocation();

    const [from, setFrom] = useState('');

    useEffect(() => {
        setFrom(`${location.pathname}`)
    }, [location.pathname])

    if (!isAuthenticated && !loading) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(from)}`} replace />;
    }

    if (loading) {
        return <EmptyPage />;
    }

    return <Outlet />;
};

export default PrivateRoute;