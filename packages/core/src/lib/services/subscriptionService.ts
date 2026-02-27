import { apiFetchJson, apiFetch } from './apiClient';

export const subscriptionService = {
    check: (targetId: number, type: string) => apiFetchJson(`/api/subscribe/${targetId}`, { method: 'GET' }, {type}),
    create: (targetId: number, type: string) => apiFetch(`/api/subscribe/${targetId}`, { method: 'POST' }, {type}),
    delete: (targetId: number, type: string) => apiFetch(`/api/subscribe/${targetId}`, { method: 'DELETE' }, {type}),

    toggle: async (id, setSubscribed, subscribed, type, e) => {
        if (e) e.stopPropagation();
        setSubscribed(!subscribed); // мгновенный отклик
        try {
            let data;
            if (subscribed) {
                data = await subscriptionService.delete(id, type);
            } else {
                data = await subscriptionService.create(id, type);
            }
            if (!data.ok) {
                setSubscribed(subscribed);
            }
        } catch (e) {
            setSubscribed(subscribed);
            console.error(e);
        }
    }
}