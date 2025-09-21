// apiClient.js
import { API_BASE } from "@/api/config";
import i18n from '@/lib/i18n';

let isRefreshing = false;
let refreshPromise = null;

async function refreshToken(setAuthenticated) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) {
                    if (setAuthenticated) {
                        setAuthenticated(false);
                    }
                    throw new Error("Refresh failed");
                }
                return res;
            })
            .finally(() => {
                isRefreshing = false;
            });
    }
    return refreshPromise;
}

export async function apiFetch(url, options = {}, extraParams = {}, setAuthenticated) {

    const makeRequest = async () => {

        const baseParams = { locale: `${i18n.language}`, ...extraParams };
        const queryString = new URLSearchParams(baseParams).toString();

        const headers = {
            ...(options.headers || {}),
        };

        const separator = url.includes("?") ? "&" : "?";

        return fetch(`${API_BASE}${url}${separator}${queryString}`, {
            ...options,
            headers,
            credentials: "include",
        });
    };

    let res = await makeRequest();

    if (res.status === 401) {
        try {
            const refreshRes = await refreshToken(setAuthenticated);
            if (refreshRes.ok) {
                await makeRequest();
            }
        } catch (e) {
            console.error("Не удалось обновить токен:", e);
            throw e;
        }
    }

    if (!res.ok) {
        throw new Error(`Ошибка запроса: ${res.status}`);
    }

    return res.json();
}