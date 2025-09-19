// apiClient.js
import { API_BASE } from "@/api/config";
import i18n from '@/lib/i18n';

let isRefreshing = false;
let refreshPromise = null;

async function refreshToken() {
    if (!isRefreshing) {
        isRefreshing = true;
        console.log("Обновлеяем недействительный токен");
        refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) {
                    console.log("Обновление не удалось");
                    localStorage.removeItem("accessToken");
                    throw new Error("Refresh failed");
                }
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
    if (!token) {
        console.log("Токен пустой");
        token = await refreshToken();
    }

    console.log("ApiFetch Начат");
    const makeRequest = async (authToken) => {
        
        console.log("Делаем запрос");
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

    console.log("Статус ответа ", res.status);

    if (res.status === 401) {
        console.log("401 ошибка");
        try {
            console.log("обновляем токен");
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