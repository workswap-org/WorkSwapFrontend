import Tooltip from "@core/components/common/Tooltip/Tooltip";
import { formatSignedValue } from "@core/lib/services/utilsService"
import { statisticService } from "@core/lib/services/statisticService";
import { useEffect, useState } from "react";
import { Interval } from "@core/lib/constants/intervalType";
import ArrowIcon from "@core/components/common/icons/ArrowIcon";

interface IViewsMetrics {
    viewsCount: number;
    standartsUsersViewsCount: number;
    tempUsersViewsCount: number;
    viewsChange: number;
    standardUsersViewsChange: number;
    tempUsersViewsChange: number;
}

const ViewsStatCard = ({interval}: {interval: Interval}) => {
    const [viewsCount, setViewsCount] = useState(0)
    const [metrics, setMetrics] = useState<IViewsMetrics | null>(null);

    useEffect(() => {
        async function loadOnlineMetrics(interval: Interval) {
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
        Все просмотры: ${formatSignedValue(metrics?.viewsChange || 0)}
        Просмотры от обычных пользователей: ${formatSignedValue(metrics?.standardUsersViewsChange || 0)}
        Просмотры от временных пользователей: ${formatSignedValue(metrics?.tempUsersViewsChange || 0)}
    `

    return (
        <div className="stat-card">
            <div className="stat-card__title">Просмотры</div>
            <Tooltip text={onlineMetricsText}>
                <div className="stat-card__value">
                    <span id="value">{viewsCount}</span>
                    <span id="change">({formatSignedValue(metrics?.viewsChange || 0)})</span>
                </div>
            </Tooltip>
            {metrics && (
                <div className={`stat-card__change ${metrics.viewsChange > 0 ? "positive" : "negative"}`}>
                    {metrics.viewsChange > 0 ? <ArrowIcon up /> : <ArrowIcon down />}
                    <span>{(metrics.viewsChange / metrics.viewsCount * 100).toFixed(0)}%</span>
                </div>
            )}
            {/* <FormattedDate isoDate={metrics?.peakDay} format="DM"/> */}
        </div>
    );

};

export default ViewsStatCard;