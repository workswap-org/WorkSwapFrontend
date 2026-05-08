import { useEffect, useState } from "react";
import { userService } from "@core/lib";
import { FormattedDate } from "@core/components"
import { Link } from "react-router-dom";

const RecentUsers = () => {

    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await userService.getRecentUsers(3);
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadUsers();
    }, []);

    const handleRowClick = () => {
        window.location.href = "/users";
    };

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead style={{ cursor: "pointer" }} onClick={handleRowClick}>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Регистрация</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>#{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><FormattedDate isoDate={user.createdAt} format="DMY"/></td>
                                <td>{user.status}</td>
                                <td>
                                    <Link to={`/user/${user.id}`} className="btn btn-primary">
                                        <i className="fa-solid fa-user-cog"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">
                                Нет пользователей
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RecentUsers;