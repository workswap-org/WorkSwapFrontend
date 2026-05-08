import StatCard from "./statCards/StatCard";
import OnlineStatCard from "./statCards/OnlineStatCard";
import { useState } from "react";
import UsersStatCard from "./statCards/UsersStatCard";
import ListingsStatCard from "./statCards/ListingsStatCard";
import ViewsStatCard from "./statCards/ViewsStatCard";

export const Intervals = Object.freeze({
    ONE_DAY: { type: "DAY", multiplier: 1, title: "1 День" },
    THREE_DAYS: { type: "DAY", multiplier: 2, title: "3 Дня" },
    ONE_WEEK: { type: "DAY", multiplier: 7, title: "1 Неделя" },
    TWO_WEEKS: { type: "DAY", multiplier: 14, title: "2 недели" },
    ONE_MONTH: { type: "DAY", multiplier: 30, title: "1 Месяц" },
});

const StatGrid = () => {

    const [interval, setInterval] = useState(Intervals.ONE_WEEK);

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
                <OnlineStatCard title="Онлайн" />
                <UsersStatCard title="Пользователи" interval={interval} />
                <ListingsStatCard title="Объявления" interval={interval} />
                <ViewsStatCard title="Просмотры" interval={interval} />
                {/* <StatCard value={0} title="Доход" /> */}
            </div>
        </div>
    );
};

export default StatGrid;