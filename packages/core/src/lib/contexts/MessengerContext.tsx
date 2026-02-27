import { createContext, useContext } from "react";
import { IShortListing , IChat, GroupedMessages, IChatMessage, Order, IShortUser, IChatDetails } from "../types";

interface MessengerContextType {
    setAllMessages: React.Dispatch<React.SetStateAction<IChatMessage[] | null>>, 
    messages: GroupedMessages[] | null,
    currentChat: IChat | null,
    currentChatId: number | null,
    setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>,
    chatListingVisible: boolean,
    setChatListingVisible: React.Dispatch<React.SetStateAction<boolean>>,
    order: Order | null,
    chats: IChat[] | null,
    setChats: React.Dispatch<React.SetStateAction<IChat[] | null>>, 
    createNewChat: (chatId: number) => void,
    pushMessages: (messages: IChatMessage[] | IChatMessage) => void,
    unreadMessages: IChatMessage[] | null,
    pushDetails: (details: IChatDetails[]) => void
}

export const MessengerContext = createContext<MessengerContextType | null>(null);

export const useChats = () => {
    const ctx = useContext(MessengerContext);
    if (!ctx) {
        throw new Error("useChats must be used inside MessengerProvider");
    }
    return ctx;
}