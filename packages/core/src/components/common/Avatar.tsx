"use client";

import { IShortUser, IShortUserProfile, IUser } from "@core/lib/types/models/user";
import { redirect } from "next/navigation";

interface AvatarProps {
    user: IShortUser | IUser | IShortUserProfile | null;
    size: number | null;
    className?: string;
    link?: boolean;
}

const Avatar = ({ user, size = 40, className = "", link = true}: AvatarProps) => {

    const interactive = !!(link && user?.openId)

    const handleClick = () => {
        if (interactive) redirect(`/profile/${user?.openId}`);
    };

    return (
        <img
            className={`${className} avatar ${interactive ? "interactive" : ""}`}
            src={user?.avatarUrl || "/images/placeholders/avatar-placeholder.png"}
            alt="Аватар"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
            }}
            onClick={handleClick}
            onError={(e) => { e.currentTarget.src = "/images/placeholders/avatar-placeholder.png"; }}
        />
    );
};

export default Avatar;