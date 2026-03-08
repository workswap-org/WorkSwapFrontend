import { AuthContext } from "../contexts/AuthContext";
import { userService } from "../services/user";

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {

    const { user, isAuthenticated, loading, shortUser, isAdmin } = userService.useCurrentUser();

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, shortUser, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};