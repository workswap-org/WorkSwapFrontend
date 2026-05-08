import { FormattedDate, Tooltip } from "@core/components";
import { formatSignedValue, statisticService } from "@core/lib";
import { useEffect, useState } from "react";

const ViewsStatCard = ({interval}) => {
    const [viewsCount, setViewsCount] = useState(0)
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        async function loadOnlineMetrics(interval) {
            const data = await statisticService.getViewsCountMetrics(interval.type, interval.multiplier);
            console.log(data)
            setMetrics(data);
            setViewsCount(data.viewsCount);
        }

        loadOnlineMetrics(interval)
    }, [interval])

    const onlineMetricsText = `Всего просмотров: ${metrics?.viewsCount} 
        Просмотры от обычных пользователей: ${metrics?.standartsUsersViewsCount}
        Просмотры от временных пользователей: ${metrics?.tempUsersViewsCount}

        Показатели: (${interval.title})
        Все просмотры: ${formatSignedValue(metrics?.viewsChange)}
        Просмотры от обычных пользователей: ${formatSignedValue(metrics?.standardUsersViewsChange)}
        Просмотры от временных пользователей: ${formatSignedValue(metrics?.tempUsersViewsChange)}
    `

    return (
        <div className="stat-card">
            <div className="stat-card__title">Просмотры</div>
            <Tooltip text={onlineMetricsText}>
                <div className="stat-card__value">
                    <span id="value">{viewsCount}</span>
                    <span id="change">({formatSignedValue(metrics?.viewsChange)})</span>
                </div>
            </Tooltip>
            <div className={`stat-card__change ${metrics.viewsChange > 0 ? "positive" : "negative"}`}>
                <i className={`fa-solid fa-arrow-${metrics.viewsChange > 0 ? "up" : "down"}`}></i>
                <span>{(metrics.viewsChange / metrics.viewsCount * 100).toFixed(0)}%</span>
            </div>
            {/* <FormattedDate isoDate={metrics?.peakDay} format="DM"/> */}
        </div>
    );

};

export default ViewsStatCard;