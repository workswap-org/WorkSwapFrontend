import "#/css/public/pages/messenger-page.css"
import DialogItem from "@/components/chat/DialogItem";

import { useEffect, useState } from "react";
import { useStompClient } from "@/hooks/messenger/useStompClient";
import { useChatsUpdates } from "@/hooks/messenger/useChatsUpdates";
import { useTranslation } from "react-i18next";
import ChatContainer from "./ChatContainer";

const MessengerPage = () => {
    const { i18n } = useTranslation();
    const userLocale = i18n.language || "ru";
    const [currentChatId, setCurrentChatId] = useState([]);

    const { client, connected } = useStompClient();
    const [chats, setChats] = useState([]);

    useChatsUpdates(client, chats, setChats, currentChatId);

    useEffect(() => {

        function loadChats(client) {
            if (!client || !client.active) return;

            client.publish({
                destination: "/app/getChats",
                headers: { 
                    locale: userLocale
                },
                body: JSON.stringify({})
            });
        }

        if (!connected || !client) return;

        // подписка на личные сообщения
        const sub = client.subscribe("/user/queue/chats", (message) => {
            const chat = JSON.parse(message.body);

            setChats(prev => {
                // если чат уже есть, обновляем его, иначе добавляем
                const existingIndex = prev.findIndex(c => c.id === chat.id);
                if (existingIndex >= 0) {
                    const newChats = [...prev];
                    newChats[existingIndex] = chat;
                    return newChats;
                }
                return [chat, ...prev];
            });
        });

        // Подписка на обновление информации о собеседнике
        client.subscribe('/user/queue/interlocutorInfo', function (message) {
            const interlocutorInfo = JSON.parse(message.body);
            if (interlocutorInfo && interlocutorInfo.name && interlocutorInfo.avatar) {
                document.getElementById('interlocutorName').innerText = interlocutorInfo.name;
                document.getElementById('interlocutorAvatar').src = interlocutorInfo.avatar;
            }
        });

        // Загружаем разговоры сразу после подключения
        loadChats(client, userLocale);

        return () => sub.unsubscribe();
    }, [client, connected, userLocale]);

    return (
        <>
            <div className="account-header">
                <h2>Сообщения</h2>
                <button id="dialogsToggleBtn" className="btn btn-primary mobile-dialogs-toggle">
                    <i className="fa fa-comments"></i>
                </button>
            </div>

            <div className="messenger-container">
            {/* Список диалогов */}
            <div id="listingCardContainer" className="listing-card-container appearance-left-animation"></div>

            <div className="dialogs-list">
                {chats.length === 0 && (
                    <div className="no-dialogs" id="no-dialogs">
                        <p th:text="#{my.messages.no-messages}">У вас пока нет сообщений.</p>
                        <p th:text="#{my.messages.start.dialog}">Начните общение, ответив на объявление или отправив сообщение пользователю.</p>
                    </div>
                )}
                {chats
                    .slice()
                    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                    .map(chat => (
                    <DialogItem 
                        key={chat.id} 
                        chat={chat} 
                        onClick={() => setCurrentChatId(chat.id)} 
                    />
                ))}
            </div>
            {/* Окно чата th:if="${selectedChat != null}" */}
            <div className="chat-window">
                <ChatContainer currentChatId={currentChatId}/>
            </div>
        </div>
        </>
    );
};

export default MessengerPage;