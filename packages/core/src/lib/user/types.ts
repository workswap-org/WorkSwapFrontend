import { IShortListing } from "./listing";

export interface IShortUser {
    id: number;
    openId: string;
    name: string;
    avatarUrl?: string;
}

export interface IShortUserProfile extends IShortUser {
    phone: string | null;
    email: string | null;
    bio: string | null;
    languages: string[] | null;
    rating: number;
    createdAt: string;
}

export interface IUser extends IShortUser {
    phone: string | null;
    email: string;
    bio: string | null;
    languages: string[];
    roles: string[];
    rating: number | null;
    createdAt: string;
};

export interface IFullUser extends IUser {
    type: string;
    provider: string;
    roles: string[];
    locationId: number | null;
    status: string | null;
    avatarType: string;
    telegramConnected: boolean;
    termsAccepted: boolean;
    termsAcceptanceDate: string;
    googleAvatar: string | null;
    uploadedAvatar: string | null;
    phoneVisible: boolean;
    emailVisible: boolean;
};

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