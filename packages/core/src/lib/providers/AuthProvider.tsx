import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { userService, IShortUser, IUser } from "../../lib";

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isAuthenticated = useMemo<boolean>(() => {
        if (!user) return false;
        return user?.email?.length > 0;
    }, [user]);
    const isAdmin = useMemo<boolean>(() => user?.roles?.includes("ADMIN") ?? false, [user]);
    const shortUser = useMemo<IShortUser | null>(() => {
        if (!isAuthenticated || !user) return null;
        return { id: user.id, openId: user.openId, name: user.name, avatarUrl: user.avatarUrl ?? "" }
    }, [isAuthenticated, user])

    const loadUser = useCallback(async () => {
        try {
            const currentUser: IUser = await userService.getCurrent();
            setUser(currentUser);
            console.log(currentUser);
            return true;
        } catch (e) {
            console.error(e);
            setUser(null);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {

        loadUser();
        
    }, [loadUser]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, shortUser, setUser, loading, loadUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};