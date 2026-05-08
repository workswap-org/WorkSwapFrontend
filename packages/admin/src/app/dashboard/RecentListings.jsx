import { useEffect, useState } from "react";
import { getRecentListings } from "@core/lib";
import {
    PriceTypes,
    FormattedDate
} from "@core/components";

const RecentListings = () => {

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        getRecentListings(3).then(data => setListings(data))
    }, [])

    const handleRowClick = () => {
        window.location.href = "/listings";
    };

    return (
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
                                        <a href={`/listing/${listing.id}`} className="btn btn-secondary mr-1">
                                            <i className="fa-solid fa-eye"></i>
                                        </a>
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
    );
};

export default RecentListings;