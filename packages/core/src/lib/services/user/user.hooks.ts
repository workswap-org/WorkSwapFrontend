import { IUser } from "@core/lib/types";
import { useEffect, useState } from "react";
import { userApi } from "./user.service";

export function useCurrentUser() {
    const [user, setUser] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);

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

    return { user, loading };
}