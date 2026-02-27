import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    useWebSocket,
    useAuth,
    useChats,
    IChatMessage
} from "@core/lib";
import { TextareaRT1 } from "@core/components";

const SendMessageArea = () => {
    const { user } = useAuth();

    const { currentChatId, pushMessages } = useChats();

    const { client, connected } = useWebSocket();
    const { t } = useTranslation();
    const [message, setMessage] = useState("");

    // Проверка, можно ли писать сообщение
    const isDisabled = !currentChatId;

    const sendMessage = () => {

        if (!client || !connected || !user) return;

        if (!currentChatId) {
            alert("Пожалуйста, выберите диалог для отправки сообщения");
            return;
        }

        const trimmed = message.trim();
        if (!trimmed) return;

        const newMsg: IChatMessage = {
            id: Date.now(),
            text: trimmed,
            senderId: user.id,
            chatId: currentChatId,
            sentAt: new Date().toISOString(),
            read: false
        }

        pushMessages(newMsg)
        
        const msg = {
            text: trimmed,
            senderId: user.id,
            chatId: currentChatId
        };

        client.publish({
            destination: `/app/chat.message-send`,
            body: JSON.stringify(msg)
        });

        setMessage(""); // очищаем поле ввода
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="message-input-container">
            <TextareaRT1
                value={message} 
                setValue={setMessage} 
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                className="" 
                placeholder={isDisabled ? "" : t(`placeholders.typeMessage`, { ns: 'common' })}
            />
            <button
                className="send-btn"
                onClick={sendMessage}
                disabled={isDisabled}
            >
                <img src="/images/send-btn.png" alt="Отправить" />
            </button>
        </div>
    );
};
export default SendMessageArea;