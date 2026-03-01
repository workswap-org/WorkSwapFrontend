"use client"

import { IShortUser, IUser } from "@core/lib/types";
import { useEffect, useMemo, useState } from "react";
import { userApi } from "./user.service";

export function useCurrentUser() {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useMemo<boolean>(() => {
        if (!user) return false;
        return user?.email?.length > 0;
    }, [user]);
    const isAdmin = useMemo<boolean>(() => user?.roles?.includes("ADMIN") ?? false, [user]);
    const shortUser = useMemo<IShortUser | null>(() => {
        if (!isAuthenticated || !user) return null;
        return { id: user.id, openId: user.openId, name: user.name, avatarUrl: user.avatarUrl ?? "" }
    }, [isAuthenticated, user])

    useEffect(() => {
        let cancelled = false;

        userApi.getCurrent().then(data => {
            if (!cancelled) {
                setUser(data);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return { user, isAuthenticated, isAdmin, shortUser, loading };
}