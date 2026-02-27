import React from "react";
import { Avatar } from "@core/components";
import { IUser } from "@core/lib";
import { Link } from "react-router-dom";

type UserCardProps = {
    user: IUser;
};

const UserCard: React.FC<UserCardProps> = ({user}) => {

    return (
        <Link to={`/users/${user.openId}`} className="user-card">
            <Avatar user={user} size={80} />
            <span>{user.name}</span>
        </Link>
    );
};

export default UserCard;