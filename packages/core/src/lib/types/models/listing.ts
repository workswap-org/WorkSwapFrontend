import { ListingTypeValue } from "../../constants/listingTypes";
import { IChat } from "../messenger";
import { IShortUser, IShortUserProfile } from "./user";

export interface IShortListing {
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

export interface IFullListing extends IShortListing {
    authorId: number;
    publicType: string | null;
    category: string;
    categoryId: number | null;
    locationId: number | null;
    views: number;
    active: boolean;
    testmode: boolean;
    temporary: boolean;
}

export interface IListingPageRequest {
    listing: IFullListing;
    author: IShortUserProfile;
    images: IListingImage[] | null;
}

export interface IEventPageRequest extends IListingPageRequest {
    event: IEventData;
    participants: IShortUser[] | null;
    participantsCount: number | null
    chat: IChat | null
}

export interface IEventData {
    eventDate: string | null;
    registrationCloseTime: string;
    recurring: boolean;
    recurrencePattern: string;
    eventStatus: string;
    isPublic: boolean;
    maxParticipants: number;
    minParticipants: number;
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