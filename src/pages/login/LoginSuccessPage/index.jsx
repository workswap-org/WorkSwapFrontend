// LoginSuccessPage.jsx
import { useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccessPage = () => {
    const { user, loadUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        if (user) {
            const from = new URLSearchParams(location.search).get("redirect") || "/";
            console.log("from ", from);
            navigate(from, { replace: true });
        }
    }, [location.search, navigate, user]);
    
    return <></>;
};

export default LoginSuccessPage;