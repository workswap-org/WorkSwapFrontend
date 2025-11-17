import { useEffect, useState } from "react";
import { getInterlocutorInfo, useChats } from "@core/lib";
import { Avatar } from "@core/components";

const DialogItem = ({ chat, changeChat, startChatId }) => {

    const { currentChat } = useChats();

    const [interlocutor, setInterlocutor] = useState({ name: "User", avatarUrl: "/images/avatar-placeholder.png" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadInterlocutorInfo() {
            const data = await getInterlocutorInfo(chat.id);
            setInterlocutor(data.interlocutor)
            setLoading(false)
        }

        loadInterlocutorInfo();
    }, [chat.id]);

    useEffect(() => {

        if(!loading && startChatId == chat.id) changeChat(chat.id, interlocutor); 

        if(!loading && !startChatId && !currentChat.id) {

            changeChat(chat.id, interlocutor);
        }

    }, [changeChat, loading, chat, startChatId, interlocutor, currentChat.id]);

    const formattedDate = chat.lastMessageTime 
        ? new Date(chat.lastMessageTime).toLocaleDateString('ru-RU')
        : "";

    return (
        <div className="dialog-item-box">
            <div className="dialog-item" onClick={() => changeChat(chat.id, interlocutor)}>
                <Avatar user={interlocutor} size={50} />
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