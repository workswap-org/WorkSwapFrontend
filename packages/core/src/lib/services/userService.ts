import { apiFetchJson, apiFetch, apiFetchText } from './apiClient';

export const userService = {
    getCurrent: () => apiFetchJson(`/user`),
    getById: (userId: number) => apiFetchJson(`/user/${userId}`),
    getUserProfile: (userOpenId: string) => apiFetchJson(`/user/${userOpenId}/profile`),
    connectUserTelegram: () => apiFetchText('/user/telegram', {method: 'POST'}),
    checkTelegramConnected: () => apiFetchJson('/user/telegram'),
    deleteCurrentUser: () => apiFetch('/user', { method: 'DELETE'}),
    getUserSettings: () => apiFetchJson(`/user/settings`),
    getRecentUsers: (count: number) => apiFetchJson(`/user/recent`, {}, {count}),

    getFullUserInfo: (userOpenId: string) => apiFetchJson(`/user/${userOpenId}/full-info`),

    modifyUserSettings: (updates: Record<string, any>) => 
        apiFetch(`/user/modify`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        })
}