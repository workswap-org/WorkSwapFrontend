"use client"

import { useEffect, useState } from "react";
import { userService } from "@core/lib/user/services";
import FormattedDate from "@core/components/common/date/FormattedDate"
import { IUser } from "@core/lib/user/types";
import Link from "next/link";
import UserGearIcon from "@core/components/common/icons/UserGearIcon"
import Table, { Columns, TableItem } from "@/components/ui/Table/Table";

const RecentUsers = () => {

    const [users, setUsers] = useState<IUser[] | null>(null);
    
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

    const columns: Columns = {
        id: { title: "ID" },
        name: { title: "Имя" },
        email: { title: "Email" },
        regDate: { title: "Регистрация" },
        actions: { title: "Действия" }
    }

    const items: TableItem[] = []

    users?.map(user => items.push({
        id: `#${user.id}`,
        name: user.name,
        email: user.email || "-",
        regDate: <FormattedDate isoDate={user.createdAt} format="DMY"/>,
        actions: [
            <Link 
                key={`action-viewUser`} 
                href={`/user/${user.id}`} 
                className="btn btn-primary"
            >
                <UserGearIcon />
            </Link>
        ]
    }))

    return users && (
        <>
            <h2>Последние пользователи</h2>
            <Table
                href={"/users"}
                columns={columns} 
                items={items}
            />
        </>
    )
};

export default RecentUsers;