"use client"

import { useEffect, useState } from "react";
import { listingService } from "@core/lib/listing/services"
import { IShortListing } from "@core/lib/listing/types";
import PriceTypes from "@core/components/common/PriceTypes/PriceTypes"
import FormattedDate from "@core/components/common/date/FormattedDate"
import EyeIcon from "@core/components/common/icons/EyeIcon"
import Link from "next/link";
import Table, { Columns, TableItem } from "@/components/ui/Table/Table";

const RecentListings = () => {

    const [listings, setListings] = useState<IShortListing[] | null>(null);
    
    useEffect(() => {
        listingService.getRecentListings(3).then(data => setListings(data))
    }, [])

    const columns: Columns = {
        id: { title: "ID" },
        title: { title: "Название" },
        price: { title: "Цена" },
        date: { title: "Дата" },
        actions: { title: "Действия" }
    }

    const items: TableItem[] = []

    listings?.map(listing => items.push({
        id: `#${listing.id}`,
        title: listing.localizedTitle,
        price: <PriceTypes listing={listing} />,
        date: <FormattedDate isoDate={listing.publishedAt} format="DMY"/>,
        actions: [
            <Link 
                key={`action-viewListing`} 
                href={`/listing/${listing.id}`} 
                className="btn btn-secondary"
            >
                <EyeIcon />
            </Link>
        ]
    }))

    return listings && (
        <>
            <h2>Последние объявления</h2>
            <Table
                href={"/listings"}
                columns={columns} 
                items={items}
            />
        </>
    )
};

export default RecentListings;