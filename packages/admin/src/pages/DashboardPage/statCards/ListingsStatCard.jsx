import { FormattedDate, Tooltip } from "@core/components";
import { formatSignedValue, statisticService } from "@core/lib";
import { useEffect, useState } from "react";

const ListingsStatCard = ({interval}) => {
    const [listingsCount, setListingsCount] = useState(0)
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        async function loadOnlineMetrics(interval) {
            const data = await statisticService.getListingsCountMetrics(interval.type, interval.multiplier);
            console.log(data)
            setMetrics(data);
            setListingsCount(data.publishedListingsCount);
        }

        loadOnlineMetrics(interval)
    }, [interval])

    const onlineMetricsText = `Всего объявлений: ${metrics?.listingsCount} 
        Активных объявлений: ${metrics?.publishedListingsCount}
        Черновиков объявлений: ${metrics?.temporaryListingsCount}

        Показатели: (${interval.title})
        Все объявления: ${formatSignedValue(metrics?.listingsChange)}
        Активных объявлений: ${formatSignedValue(metrics?.publishedListingsChange)}
        Черновиков объявлений: ${formatSignedValue(metrics?.temporaryListingsChange)}
    `

    return (
        <div className="stat-card">
            <div className="stat-card__title">Объявления</div>
            <Tooltip text={onlineMetricsText}>
                <div className="stat-card__value">
                    <span id="value">{listingsCount}</span>
                    <span id="change">({formatSignedValue(metrics?.listingsChange)})</span>
                </div>
            </Tooltip>
            <div className={`stat-card__change ${metrics.publishedListingsChange > 0 ? "positive" : "negative"}`}>
                <i className={`fa-solid fa-arrow-${metrics.publishedListingsChange > 0 ? "up" : "down"}`}></i>
                <span>{(metrics.listingsChange / metrics.listingsCount * 100).toFixed(0)}%</span>
            </div>
            {/* <FormattedDate isoDate={metrics?.peakDay} format="DM"/> */}
        </div>
    );
};

export default ListingsStatCard;