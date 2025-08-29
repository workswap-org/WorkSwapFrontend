// apiClient.js
import { API_BASE } from "@/api/config";
import i18n from '@/lib/i18n';

let isRefreshing = false;
let refreshPromise = null;

async function refreshToken() {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json();
            })
            .then(data => {
                if (!data.accessToken) throw new Error("No access token in response");
                localStorage.setItem("accessToken", data.accessToken);
                return data.accessToken;
            })
            .finally(() => {
                isRefreshing = false;
            });
    }
    return refreshPromise;
}

export async function apiFetch(url, options = {}, extraParams = {}) {
    let token = localStorage.getItem("accessToken");

    const makeRequest = async (authToken) => {
        // базовые параметры
        const baseParams = { locale: `${i18n.language}`, ...extraParams };

        const queryString = new URLSearchParams(baseParams).toString();

        const headers = {
            ...(options.headers || {}),
            Authorization: authToken ? `Bearer ${authToken}` : "",
        };

        // проверим, есть ли уже ?
        const separator = url.includes("?") ? "&" : "?";

        return fetch(`${API_BASE}${url}${separator}${queryString}`, {
            ...options,
            headers,
            credentials: "include",
        });
    };

    let res = await makeRequest(token);

    if (res.status === 401) {
        try {
            token = await refreshToken();
            res = await makeRequest(token);
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