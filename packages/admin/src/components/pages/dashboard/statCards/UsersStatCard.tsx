import Tooltip from "@core/components/common/Tooltip/Tooltip";
import { formatSignedValue } from "@core/lib/services/utilsService"
import { statisticService } from "@core/lib/services/statisticService";
import { useEffect, useState } from "react";
import ArrowIcon from "@core/components/common/icons/ArrowIcon";
import StatCard from "../StatCard/StatCard";

const UsersStatCard = ({interval}: {interval: Interval}) => {
    const [usersCount, setUsersCount] = useState(0)
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        async function loadOnlineMetrics(interval) {
            const data = await statisticService.getUsersCountMetrics(interval.type, interval.multiplier);
            console.log(data)
            setMetrics(data);
            setUsersCount(data.usersCount);
        }

        loadOnlineMetrics(interval)
    }, [interval])

    const metricsText = `Всего пользователей: ${metrics?.usersCount} 
        Зарегистрированных пользователей: ${metrics?.standartsUsersCount}
        Временных пользователей: ${metrics?.tempUsersCount}

        Показатели: (${interval.title})
        Все пользователи: ${formatSignedValue(metrics?.usersChange)}
        Зарегистрированные пользователи: ${formatSignedValue(metrics?.standardUsersChange)}
        Временные пользователи: ${formatSignedValue(metrics?.tempUsersChange)}
    `

    return metrics && (
        <StatCard
            title={"Пользователи"}
            value={usersCount}
            change={metrics?.usersChange}
            tooltip={metricsText}
            changePercent={metrics.standardUsersChange / metrics.standartsUsersCount * 100}
            isPositive={metrics.standardUsersChange > 0}
        />
    )
};

export default UsersStatCard;