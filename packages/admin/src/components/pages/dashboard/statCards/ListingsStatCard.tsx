import Tooltip from "@core/components/common/Tooltip/Tooltip";
import { Interval } from "@core/lib/constants/intervalType";
import { statisticService } from "@core/lib/services/statisticService";
import { formatSignedValue } from "@core/lib/services/utilsService"
import { useEffect, useState } from "react";
import StatCard from "../StatCard/StatCard";

const ListingsStatCard = ({interval}: {interval: Interval}) => {
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

    const metricsText = `Всего объявлений: ${metrics?.listingsCount} 
        Активных объявлений: ${metrics?.publishedListingsCount}
        Черновиков объявлений: ${metrics?.temporaryListingsCount}

        Показатели: (${interval.title})
        Все объявления: ${formatSignedValue(metrics?.listingsChange)}
        Активных объявлений: ${formatSignedValue(metrics?.publishedListingsChange)}
        Черновиков объявлений: ${formatSignedValue(metrics?.temporaryListingsChange)}
    `

    return metrics && (
        <StatCard 
            title={"Объявления"}
            value={listingsCount}
            change={metrics?.listingsChange}
            tooltip={metricsText}
            changePercent={metrics.listingsChange / metrics.listingsCount * 100}
            isPositive={metrics.publishedListingsChange > 0}
        />
    )
};

export default ListingsStatCard;