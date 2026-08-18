"use client"

import { useEffect, useState } from "react";
import { IUser } from "@core/lib/user/types";
import { userService } from "@core/lib/user/services";
import Table, { Columns, TableItem } from "@/components/ui/Table/Table";
import Link from "next/link";
import FormattedDate from "@core/components/common/date/FormattedDate";
import UserGearIcon from "@core/components/common/icons/UserGearIcon";
import Card from "@/components/ui/Card/Card";
import { Page } from "@core/lib/common/types/page";
import Loader from "@core/components/common/Loader/Loader";

export default function UsersPage() {

    const [users, setUsers] = useState<IUser[] | null>(null);
    const [sortParam, setSortParam] = useState<string>("id");
    
    useEffect(() => {
        async function loadUsers() {
            const data: Page<IUser> = await userService.getUsersList(0, 10, sortParam);
            console.log(data)
            setUsers(data.content);
        }

        loadUsers();
    }, [sortParam])

    const columns: Columns = {
        id: { title: "ID", sortable: true },
        name: { title: "Имя", sortable: true },
        email: { title: "Email", sortable: true },
        createdAt: { title: "Регистрация", sortable: true },
        actions: { title: "Действия" }
    }

    const items: TableItem[] = users?.map(user => ({
        id: `#${user.id}`,
        name: user.name,
        email: user.email || "-",
        createdAt: <FormattedDate isoDate={user.createdAt} format="DMY" />,
        actions: [
            <Link
                key={`action-viewUser-${user.id}`}
                href={`/user/${user.id}`}
                className="btn btn-primary"
            >
                <UserGearIcon />
            </Link>
        ]
    })) ?? [];

    return (
        <Card>
            <Loader loadingActive={!users}>
                <Table
                    onColumnClick={(sort) => setSortParam(sort)}
                    columns={columns} 
                    items={items}
                />
            </Loader>
        </Card>
    )
}