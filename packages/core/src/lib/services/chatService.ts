import { apiFetchJson, apiFetchText } from './apiClient';

export const chatService = {
    getInterlocutorInfo: (id: number) => apiFetchJson(`/chat/${id}/getInterlocutorInfo`),
    deleteTemporaryChats: () => apiFetchJson("/chat/temporary", { method: "POST"}),
    getPrivateChat: (interlocutorId: number) => apiFetchText(`/chat/private-chat`, {}, { interlocutorId }),
    getListingDiscussion: (listingId: number) => apiFetchText(`/chat/listing-discussion`, {}, { listingId }),
    getEventChat: (eventId: number) => apiFetchText(`/chat/event-chat`, {}, { eventId })
}