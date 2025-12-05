import { Avatar } from "@core/components";
import { GroupedMessages, MessageType, useAuth, useChats } from "@core/lib";

const MessagesGroup = ({group}: {group: GroupedMessages}) => {

    const { user } = useAuth();
    const { allIntelocutors } = useChats();
    const isOwn = (group.senderId == user?.id)
    const author = isOwn ? user : allIntelocutors.find((i) => i.user.id === group.senderId)?.user ?? null;

    return (
        <div className={`messages-group ${isOwn ? 'out' : 'in'}`}>
            <Avatar user={author} size={30} className="message-avatar"/>
            <div className="messages">
                {group.messages?.map((message) => (
                    <Message 
                        key={message.id}
                        message={message} 
                    />
                ))}
            </div>
        </div>
    )
}

const Message = ({message}: {message: MessageType}) => {

    const date = new Date(message.sentAt);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return (
        <div className="message">
            <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formattedTime}</span>
            </div>
        </div>
    );
};

export default MessagesGroup;