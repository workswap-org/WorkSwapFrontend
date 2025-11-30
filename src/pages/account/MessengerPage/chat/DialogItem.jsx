import { useEffect, useState } from "react";
import { getInterlocutorInfo, useChats } from "@core/lib";
import { Avatar } from "@core/components";
import { useLocation } from "react-router-dom";

const DialogItem = ({ chat, changeChat, pageLoading, setPageLoading }) => {
    
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const startChatId = params.get("chatId") || null;
    const isMobile = window.innerWidth <= 600;

    const { currentChatId } = useChats();

    const [dialogInterlocutor, setDialogInterlocutor] = useState({ name: "User", avatarUrl: "/images/avatar-placeholder.png" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadInterlocutorInfo() {
            const data = await getInterlocutorInfo(chat.id);
            setDialogInterlocutor(data)
            setLoading(false)
        }

        loadInterlocutorInfo();
    }, [chat.id]);

    useEffect(() => {

        if(!loading && startChatId == chat.id && pageLoading) {
            setPageLoading(false);
            
            console.log(startChatId);
            changeChat(chat.id, dialogInterlocutor);
        } 

        if(!loading && !startChatId && !currentChatId && pageLoading && !isMobile) {

            setPageLoading(false);

            console.log(startChatId);
            changeChat(chat.id, dialogInterlocutor);
        }

    }, [changeChat, loading, chat, startChatId, dialogInterlocutor, currentChatId, pageLoading, setPageLoading, isMobile]);

    const formattedDate = chat.lastMessageTime 
        ? new Date(chat.lastMessageTime).toLocaleDateString('ru-RU')
        : "";

    return (
        <div className="dialog-item-box">
            <div className="dialog-item" onClick={() => changeChat(chat.id, dialogInterlocutor)}>
                <Avatar user={dialogInterlocutor} size={50} />
                <div className="dialog-content">
                    <div className="dialog-header">
                        <h4>{dialogInterlocutor.name}</h4>
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