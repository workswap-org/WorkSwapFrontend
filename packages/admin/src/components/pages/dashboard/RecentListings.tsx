"use client"

import { useEffect, useState } from "react";
import { listingService } from "@core/lib/services/listing"
import { IShortListing } from "@core/lib/types/models/listing";
import PriceTypes from "@core/components/common/PriceTypes/PriceTypes"
import FormattedDate from "@core/components/common/date/FormattedDate"
import EyeIcon from "@core/components/common/icons/EyeIcon"
import Link from "next/link";

const RecentListings = () => {

    const [listings, setListings] = useState<IShortListing[] | null>(null);
    
    useEffect(() => {
        listingService.getRecentListings(3).then(data => setListings(data))
    }, [])

    const handleRowClick = () => {
        window.location.href = "/listings";
    };

    return listings && (
        <>
            <h2>Последние объявления</h2>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead style={{ cursor: "pointer" }} onClick={handleRowClick}>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.length > 0 ? (
                            listings.map((listing) => (
                                <tr key={listing.id}>
                                    <td>#{listing.id}</td>
                                    <td>{listing.localizedTitle}</td>
                                    <td>
                                        <PriceTypes listing={listing} />
                                    </td>
                                    <td><FormattedDate isoDate={listing.publishedAt} format="DMY"/></td>
                                    <td>
                                        <div className="button-actions">
                                            <Link href={`/listing/${listing.id}`} className="btn btn-secondary">
                                                <EyeIcon />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Нет объявлений
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default RecentListings;