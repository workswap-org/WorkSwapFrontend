import { IShortListing } from "./listing";

export type IFullUser = {
    id: number;
    openId: string;
    type: string;
    name: string;
    phone: string | null;
    email: string;
    bio: string | null;
    avatarUrl: string | null;
    provider: string;
    languages: string[];
    roles: string[];
    locationId: number | null;
    status: string | null;
    avatarType: string;
    rating: number | null;
    telegramConnected: boolean;
    termsAccepted: boolean;
    createdAt: string;
    termsAcceptanceDate: string;
    googleAvatar: string | null;
    uploadedAvatar: string | null;
    phoneVisible: boolean;
    emailVisible: boolean;
};

export type IUser = {
    id: number;
    openId: string;
    name: string;
    phone: string | null;
    email: string;
    bio: string | null;
    avatarUrl: string | null;
    languages: string[];
    roles: string[];
    rating: number | null;
    createdAt: string;
};

export interface IShortUser {
    id: number;
    openId: string;
    name: string;
    avatarUrl?: string;
}

export interface IShortUserProfile {
    id: number;
    openId: string;
    name: string;
    phone: string | null;
    email: string | null;
    avatarUrl: string | null;
    bio: string | null;
    languages: string[] | null;
    rating: number;
    createdAt: string;
}

export interface IUserProfile {
    user: IShortUserProfile;
    listings: IShortListing[] | null;
}

export interface IRole {
    id: number;
    name: string;
    level: number;
}

export interface IPermission {
    id: number;
    name: string;
    comment: string;
}

export interface IPermissionUpdate {
    permissionId: number,
    enabled: boolean
}