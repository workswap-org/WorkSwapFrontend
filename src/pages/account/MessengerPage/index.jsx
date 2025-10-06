import DialogItem from "./chat/DialogItem";
import { useEffect, useState, useCallback } from "react";
import { 
    useWebSocket,
    deleteTemporaryChats,
    useChatsUpdates
} from "@core/lib";
import { useTranslation } from "react-i18next";
import ChatContainer from "./ChatContainer";
import { useLocation } from "react-router-dom";

import PublicListingCard from "@/components/ui/cards/listing-cards/PublicListingCard";

const MessengerPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const { i18n, t } = useTranslation('common');
    const userLocale = i18n.language || "fi";
    const [startChatId, setStartChatId] = useState(params.get("chatId") || undefined);
    const [currentChatId, setCurrentChatId] = useState(undefined);
    const [currentInterlocutor, setCurrentInterlocutor] = useState([]);

    const [chatListing, setChatListing] = useState(undefined);
    const [chatListingVisible, setChatListingVisible] = useState(false);
    const [mobileDialogs, setMobileDialogs] = useState(false);

    const { client, connected } = useWebSocket();
    const [chats, setChats] = useState([]);

    useChatsUpdates(client, connected, chats, setChats, currentChatId);

    useEffect(() => {
        return () => {
            deleteTemporaryChats();
        }
    }, []);

    useEffect(() => {
        if (!currentChatId || !client || !client.active || !connected) return;

        client.publish({
            destination: "/app/chat.markAsRead",
            body: JSON.stringify({ chatId: currentChatId }),
            headers: { locale: userLocale }
        });

        const url = new URL(window.location);
        url.searchParams.set("chatId", currentChatId);
        window.history.pushState({}, '', url);
        
    }, [currentChatId, client, connected, userLocale]);

    const changeChat = useCallback((chatId, interlocutor) => {
        setCurrentChatId(chatId);
        setCurrentInterlocutor(interlocutor);
        setStartChatId(chatId)
        hideMobileDialogs()
    }, [])
 
    function showMobileDialogs() {
        setMobileDialogs(true);
    }

    function hideMobileDialogs() {
        setMobileDialogs(false);
    }

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
        if (connected) {
            client.subscribe('/user/queue/interlocutorInfo', function (message) {
                const interlocutorInfo = JSON.parse(message.body);
                if (interlocutorInfo && interlocutorInfo.name && interlocutorInfo.avatar) {
                    document.getElementById('interlocutorName').innerText = interlocutorInfo.name;
                    document.getElementById('interlocutorAvatar').src = interlocutorInfo.avatar;
                }
            });
        }

        // Загружаем разговоры сразу после подключения
        loadChats(client, userLocale);

        return () => sub.unsubscribe();
    }, [client, connected, userLocale]);

    function toggleChatListing() {
        setChatListingVisible(!chatListingVisible);
    }

    return (
        <>
            <div className="account-header flex-row">
                <h2>{t(`titles.messenger`, { ns: 'common' })}</h2>
            </div>

            <div className="messenger-container">
                {/* Список диалогов */}
                {chatListing && (
                    <div 
                        id="listingCardContainer" 
                        className={`listing-card-container appearance-left-animation ${chatListingVisible ? "visible" : ''}`}
                    >
                        <PublicListingCard 
                            key={chatListing.id}
                            listing={chatListing}
                            isMainListing={false}
                        />
                    </div>
                )}

                <div className={`dialogs-list ${mobileDialogs ? "show" : ""}`}>
                    {chats.length === 0 && (
                        <div className="no-dialogs" id="no-dialogs">
                            <p>{t(`messenger.placeholders.noDialogs`, { ns: 'common' })}</p>
                            <p>{t(`messenger.placeholders.startChats`, { ns: 'common' })}</p>
                        </div>
                    )}
                    {chats
                        .slice()
                        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                        .map(chat => (
                        <DialogItem 
                            key={chat.id}
                            startChatId={startChatId}
                            chat={chat}
                            changeChat={changeChat} 
                            currentChatId={currentChatId}
                        />
                    ))}
                </div>
                
                <div className="chat-window">
                    <ChatContainer
                        interlocutor={currentInterlocutor} 
                        currentChatId={currentChatId}
                        setChatListing={setChatListing}
                        chatListing={chatListing}
                        toggleChatListing={toggleChatListing}
                        showMobileDialogs={showMobileDialogs}
                    />
                </div>
            </div>
        </>
    );
};

export default MessengerPage;