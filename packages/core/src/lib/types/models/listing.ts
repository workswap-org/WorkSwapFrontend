import { ListingTypeValue } from "../../constants/listingTypes";
import { IChat } from "../messenger";
import { IShortUser, IShortUserProfile } from "./user";

export interface IFullListing {
    id: number;
    authorId: number;
    localizedTitle: string;
    localizedDescription: string;
    price: number;
    priceType: string;
    type: ListingTypeValue;
    publicType: string;
    category: string;
    categoryId: number;
    location: string;
    locationId: number;
    rating: number;
    views: number;
    publishedAt: string;
    active: boolean;
    imagePath: string;
    testmode: boolean;
    temporary: boolean;
    likes: number
    liked: boolean;
}

export interface IShortListing  {
    id: number;
    localizedTitle: string;
    localizedDescription: string;
    price: number;
    priceType: string;
    type: ListingTypeValue;
    location: string;
    rating: number;
    imagePath: string;
    publishedAt: string;
    likes: number
    liked: boolean;
}

export interface IListingTranslation {
    [language: string]: {
        title: string
        description: string
    }
}

export interface IListingImage {
    id: number
    listingId: number
    path: string
}

export interface IEventPageRequest {
    id: number | null;
    localizedTitle: string;
    localizedDescription: string;
    price: number;
    priceType: string;
    categoryId: number | null;
    location: string;
    rating: number;
    views: number;
    publishedAt: string | null;
    imagePath: string;
    type: string | null;
    publicType: string | null;
    eventDate: string | null;
    registrationCloseTime: string;
    recurring: boolean;
    recurrencePattern: string;
    eventStatus: string;
    isPublic: boolean;
    maxParticipants: number;
    minParticipants: number;
    author: IShortUserProfile;
    images: IListingImage[] | null;
    participants: IShortUser[] | null;
    participantsCount: number | null
    chat: IChat | null
    likes: number
    liked: boolean;
}

export interface IListingPageRequest {
    id: number | null;
    localizedTitle: string;
    localizedDescription: string;
    price: number;
    priceType: string;
    categoryId: number | null;
    location: string;
    rating: number;
    views: number;
    publishedAt: string | null;
    imagePath: string;
    type: string | null;
    publicType: string | null;
    author: IShortUserProfile;
    images: IListingImage[] | null;
    likes: number
    liked: boolean;
}

export interface IEventSettings {
    eventDate: string;
    registrationCloseTime: string;
    recurring: boolean;
    recurrencePattern: string;
    eventStatus: string;
    public: boolean;
    maxParticipants: number;
    minParticipants: number;
}