"use client"

import { useCallback, useEffect, useState } from "react";
import { IUser } from "@core/lib/user/types";
import { userService } from "@core/lib/user/services";
import Table, { Columns, TableItem } from "@/components/ui/Table/Table";
import Link from "next/link";
import FormattedDate from "@core/components/common/date/FormattedDate";
import UserGearIcon from "@core/components/common/icons/UserGearIcon";
import Card from "@/components/ui/Card/Card";
import { Page } from "@core/lib/common/types/page";
import Loader from "@core/components/common/Loader/Loader";
import Pagination from "@core/components/ui/Pagination/Pagination";

export default function UsersPage() {

    const [sortParam, setSortParam] = useState<string>("id");
    const [users, setUsers] = useState<Page<IUser> | null>(null);

    const loadUsers = useCallback(async (page: number) => {
        const data: Page<IUser> = await userService.getUsersPage(page, 10, sortParam);
        setUsers(data);
    }, [])
    
    useEffect(() => {
        loadUsers(0);
    }, [sortParam])

    const columns: Columns = {
        id: { title: "ID", sortable: true },
        name: { title: "Имя", sortable: true },
        email: { title: "Email", sortable: true },
        createdAt: { title: "Регистрация", sortable: true },
        actions: { title: "Действия" }
    }

    const items: TableItem[] = users?.content?.map(user => ({
        id: `#${user.id}`,
        name: user.name,
        email: user.email || "-",
        createdAt: <FormattedDate isoDate={user.createdAt} format="DMY" />,
        actions: [
            <Link
                key={`action-viewUser-${user.id}`}
                href={`/users/${user.openId}`}
                className="btn btn-primary"
            >
                <UserGearIcon />
            </Link>
        ]
    })) ?? [];

    return (
        <Card>
            <Loader loadingActive={!users?.content}>
                <Table
                    onColumnClick={(sort) => setSortParam(sort)}
                    columns={columns} 
                    items={items}
                />
                <Pagination
                    page={users?.page.number || 0} 
                    totalPages={users?.page.totalPages || 1} 
                    onChange={(page) => loadUsers(page)}
                />
            </Loader>
        </Card>
    )
}