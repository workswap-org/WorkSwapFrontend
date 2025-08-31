const Message = ({message}) => {

    const date = new Date(message.sentAt);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return (
        <div
            th:className="${message.isOwn(user)} ? 'message-out' : 'message-in'"
            className={`message ${message.own ? 'message-out' : 'message-in'}`}>
            <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time"
                    th:text="${#temporals.format(message.sentAt, 'HH:mm')}">{formattedTime}</span>
            </div>
        </div>
    );
};

export default Message;