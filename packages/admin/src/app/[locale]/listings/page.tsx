"use client"

import { useCallback, useEffect, useState } from "react";
import { IUser } from "@core/lib/user/types";
import Table, { Columns, TableItem } from "@/components/ui/Table/Table";
import Link from "next/link";
import FormattedDate from "@core/components/common/date/FormattedDate";
import Card from "@/components/ui/Card/Card";
import { Page } from "@core/lib/common/types/page";
import Loader from "@core/components/common/Loader/Loader";
import Pagination from "@core/components/ui/Pagination/Pagination";
import { listingService } from "@core/lib/listing/services";
import PriceTypes from "@core/components/common/PriceTypes/PriceTypes";
import EyeIcon from "@core/components/common/icons/EyeIcon";
import { IFullListing } from "@core/lib/listing/types";

export default function ListingsPage() {

    const [sortParam, setSortParam] = useState<string>("id");
    const [listings, setListings] = useState<Page<IFullListing> | null>(null);

    const loadListings = useCallback(async (page: number) => {
        const data: Page<IFullListing> = await listingService.getListingsPage(page, 10, sortParam);
        console.log(data)
        setListings(data);
    }, [])
    
    useEffect(() => {
        loadListings(0);
    }, [sortParam])

    const columns: Columns = {
        id: { title: "ID" },
        title: { title: "Название" },
        price: { title: "Цена" },
        date: { title: "Дата" },
        actions: { title: "Действия" }
    }

    const items: TableItem[] = listings?.content?.map(listing => ({
        id: `#${listing.id}`,
        title: listing.localizedTitle,
        price: <PriceTypes listing={listing} />,
        date: <FormattedDate isoDate={listing.publishedAt} format="DMY"/>,
        actions: [
            <Link 
                key={`action-viewListing-${listing.id}`} 
                href={`/listing/${listing.id}`} 
                className="btn btn-secondary"
            >
                <EyeIcon />
            </Link>
        ]
    })) ?? [];

    return (
        <Card>
            <Loader loadingActive={!listings?.content}>
                <Table
                    onColumnClick={(sort) => setSortParam(sort)}
                    columns={columns} 
                    items={items}
                />
                <Pagination
                    page={listings?.page.number || 0} 
                    totalPages={listings?.page.totalPages || 1} 
                    onChange={(page) => loadListings(page)}
                />
            </Loader>
        </Card>
    )
}