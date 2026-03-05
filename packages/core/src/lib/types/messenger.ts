import { ChatTypeValue } from "../constants/chatTypes";
import { IShortListing } from "./models/listing";
import { IShortUser } from "./models/user";


export interface IChatMessage {
    id: number;
    text: string;
    sentAt: string | null;
    senderId: number;
    chatId: number;
    read: boolean;
}

export interface GroupedMessages {
    id: number;
    senderId: number;
    messages: IChatMessage[];
}

export interface IChat {
    id: number;
    unreadCount: number;
    lastMessageText: string;
    lastMessageTime: string;
    status: string;
    type: ChatTypeValue;
    targetId: number;

    interlocutors?: IShortUser[];
    listing?: IShortListing; 
}

export interface IChatDetails {
    chatId: number;
    interlocutors: IShortUser[];
    listing: IShortListing;
}