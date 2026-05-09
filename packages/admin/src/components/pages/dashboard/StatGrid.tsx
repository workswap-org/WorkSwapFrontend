"use client"

import OnlineStatCard from "./statCards/OnlineStatCard";
import { useState } from "react";
import UsersStatCard from "./statCards/UsersStatCard";
import ListingsStatCard from "./statCards/ListingsStatCard";
import ViewsStatCard from "./statCards/ViewsStatCard";
import { Interval, Intervals } from "@core/lib/constants/intervalType"

const StatGrid = () => {

    const [interval, setInterval] = useState<Interval>(Intervals.ONE_WEEK);

    return (
        <div className="stat-section">
            <select
                value={interval.title}
                onChange={(e) => {
                    const selected = Object.values(Intervals)
                        .find(i => i.title === e.target.value);
                    setInterval(selected);
                }}
            >
                {Object.values(Intervals).map(i => (
                    <option key={i.title} value={i.title}>
                        {i.title}
                    </option>
                ))}
            </select>
            <div className="stats-grid">
                <OnlineStatCard />
                <UsersStatCard interval={interval} />
                <ListingsStatCard interval={interval} />
                <ViewsStatCard interval={interval} />
                {/* <StatCard value={0} title="Доход" /> */}
            </div>
        </div>
    );
};

export default StatGrid;