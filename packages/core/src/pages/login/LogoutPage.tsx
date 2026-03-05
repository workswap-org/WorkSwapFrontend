import { useCallback, useEffect } from "react";
import { AUTH_BASE } from "@core/config";

const LogoutPage = () => {

    const logout = useCallback(async () => {
        try {
            await fetch(AUTH_BASE + "/api/auth/logout", { method: "POST", credentials: "include", });
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            redirect("/");
        }
    }, []);

    useEffect(() => {
        logout()
    }, [logout])
    
    return (
        <></>
    );
};

export default LogoutPage;

function redirect(arg0: string) {
    throw new Error("Function not implemented.");
}
