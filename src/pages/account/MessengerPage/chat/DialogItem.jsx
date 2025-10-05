import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/services/apiClient";

const DialogItem = ({ chat, changeChat, startChatId, currentChatId }) => {

    const [interlocutor, setInterlocutor] = useState({ name: "User", avatar: "/images/avatar-placeholder.png" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadInterlocutorInfo() {
            const data = await apiFetch(`/api/chat/${chat.id}/getInterlocutorInfo`);
            setInterlocutor(data.interlocutor)
            setLoading(false)
        }

        loadInterlocutorInfo();
    }, [chat.id]);

    useEffect(() => {

        if(!loading && startChatId == chat.id) changeChat(chat.id, interlocutor); 

        if(!loading && !startChatId && !currentChatId) {

            changeChat(chat.id, interlocutor);
        }

    }, [changeChat, loading, chat, startChatId, interlocutor, currentChatId]);

    const formattedDate = chat.lastMessageTime 
        ? new Date(chat.lastMessageTime).toLocaleDateString('ru-RU')
        : "";

    return (
        <div className="dialog-item-box">
            <div className="dialog-item" onClick={() => changeChat(chat.id, interlocutor)}>
                <img className="avatar p50-avatar" src={interlocutor.avatarUrl} alt="Аватар" />
                <div className="dialog-content">
                    <div className="dialog-header">
                        <h4>{interlocutor.name}</h4>
                        <span className="dialog-time">{formattedDate}</span>
                    </div>
                    <div className="dialog-meta">
                        <p className="dialog-preview">{chat.lastMessagePreview}</p>
                        {chat.unreadCount > 0 && <span className="unread-count">{chat.unreadCount}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DialogItem;