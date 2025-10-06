import { useAuth } from "@core/lib";

const Message = ({message}) => {

    const { user } = useAuth();

    const date = new Date(message.sentAt);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    const isOwn = (message.senderId == user.id)

    return (
        <div className={`message ${isOwn ? 'message-out' : 'message-in'}`}>
            <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formattedTime}</span>
            </div>
        </div>
    );
};

export default Message;