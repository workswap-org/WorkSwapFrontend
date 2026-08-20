"use client"

import Card from "@/components/ui/Card/Card";
import styles from "./LocationsPage.module.scss"
import Loader from "@core/components/common/Loader/Loader"
import Breadcrumbs from "@core/components/ui/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { ILocation } from "@core/lib/location/types"
import { locationsService } from "@core/lib/location/locationsService"
import LocationsTable from "@/components/pages/locations/LocationsTable/LocationsTable";

const LocationsPage = () => {

    const [locations, setLocations] = useState<ILocation[] | null>(null)
    
    useEffect(() => {
        async function loadLocations() {
            const data = await locationsService.getLocations();
            setLocations(data)
        }

        loadLocations()
    }, [])

    const onAddLocation = () => {
        console.log("TODO: add location");
    };

    const onEditLocation = (id: number) => {
        console.log("TODO: edit location", id);
    };

    const onDeleteLocation = (id: number) => {
        console.log("TODO: delete location", id);
    };

    return (
        <>
            <Breadcrumbs
                crumbs={[
                    { href: "/dashboard", title: "Панель управления" },
                    { href: "#", title: "Локации" },
                ]}
            />

            <Card>
                <Loader loadingActive={!locations}>
                    <div className={styles.page}>
                        <LocationsTable
                            locations={locations || []}
                            onDeleteLocation={onDeleteLocation}
                            onEditLocation={onEditLocation}
                        />
                    </div>
                </Loader>
            </Card>
        </>
    );
};

export default LocationsPage;