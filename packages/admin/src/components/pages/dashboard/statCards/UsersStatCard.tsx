import Tooltip from "@core/components/common/Tooltip/Tooltip";
import { formatSignedValue } from "@core/lib/services/utilsService"
import { statisticService } from "@core/lib/services/statisticService";
import { useEffect, useState } from "react";
import ArrowIcon from "@core/components/common/icons/ArrowIcon";

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

    const onlineMetricsText = `Всего пользователей: ${metrics?.usersCount} 
        Зарегистрированных пользователей: ${metrics?.standartsUsersCount}
        Временных пользователей: ${metrics?.tempUsersCount}

        Показатели: (${interval.title})
        Все пользователи: ${formatSignedValue(metrics?.usersChange)}
        Зарегистрированные пользователи: ${formatSignedValue(metrics?.standardUsersChange)}
        Временные пользователи: ${formatSignedValue(metrics?.tempUsersChange)}
    `

    return (
        <div className="stat-card">
            <div className="stat-card__title">Пользователи</div>
            <Tooltip text={onlineMetricsText}>
                <div className="stat-card__value">
                    <span id="value">{usersCount}</span>
                    <span id="change">({formatSignedValue(metrics?.usersChange)})</span>
                </div>
            </Tooltip>
            <div className={`stat-card__change ${metrics.standardUsersChange > 0 ? "positive" : "negative"}`}>
                {metrics.standardUsersChange > 0 ? <ArrowIcon up /> : <ArrowIcon down />}
                <span>{(metrics.standardUsersChange / metrics.standartsUsersCount * 100).toFixed(0)}%</span>
            </div>
            {/* <FormattedDate isoDate={metrics?.peakDay} format="DM"/> */}
        </div>
    );
};

export default UsersStatCard;