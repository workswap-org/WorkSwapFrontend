import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteLogger = () => {
    const location = useLocation();

    useEffect(() => {
        /* console.log("Navigation to:", location.pathname, location.search); */
    }, [location]);

    return null; // ничего не рендерим
};

export default RouteLogger;