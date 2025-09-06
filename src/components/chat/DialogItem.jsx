import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

const DialogItem = ({ chat, onClick }) => {
    const [interlocutor, setInterlocutor] = useState({ name: "User", avatar: "/images/avatar-placeholder.png" });

    useEffect(() => {

        async function loadInterlocutorInfo() {
            const data = await apiFetch(`/api/chat/${chat.id}/getInterlocutorInfo`);
            setInterlocutor({ name: data.name, avatar: data.avatar })
        }

        loadInterlocutorInfo()
    }, [chat.id]);

    const formattedDate = chat.lastMessageTime 
        ? new Date(chat.lastMessageTime).toLocaleDateString('ru-RU')
        : "";

    return (
        <div className="dialog-item" onClick={onClick}>
            <img className="avatar p50-avatar" src={interlocutor.avatar} alt="Аватар" />
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>{interlocutor.name}</h4>
                    <span className="dialog-time">{formattedDate}</span>
                </div>
                <p className="dialog-preview">{chat.lastMessagePreview}</p>
                <div className="dialog-meta">
                    {chat.unreadCount > 0 && <span className="unread-count">{chat.unreadCount}</span>}
                    {chat.listing && <span className="dialog-listing">{chat.listing.localizedTitle}</span>}
                </div>
            </div>
        </div>
    );
};

export default DialogItem;