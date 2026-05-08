import React from "react";
import UserCard from "./UserCard";
import { userService } from "@core/lib";
import { IUser } from "@core/lib";

const UsersGrid = () => {

    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        async function loadUsers(amount:number) {
            const data = await userService.getRecentUsers(amount);
            setUsers(data);
        }

        loadUsers(30);
    }, [])
    
    return (
        <div className="users-grid">
            {users.map((user:IUser) => (
                <UserCard user={user} key={user.id}/>
            ))}
        </div>
    );
};

export default UsersGrid;