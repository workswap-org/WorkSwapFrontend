import { useState } from "react";
import { Tooltip } from "@core/components";

const StatCard = ({ value, metrics, title }) => {
    const [changePercent, setChangePercent] = useState("0%");
    const [isPositive, setIsPositive] = useState(true);

    return (
        <div className="stat-card">
            <div className="stat-card__title">{title}</div>
            <Tooltip text="Метрика">
                <div className="stat-card__value">
                    <span id="value">{value}</span>
                </div>
            </Tooltip>
            <div className={`stat-card__change ${isPositive ? "positive" : "negative"}`}>
                <i className={`fa-solid ${isPositive ? "fa-arrow-up" : "fa-arrow-down"}`}></i> 
                <span>{changePercent} за месяц</span>
            </div>
        </div>
    );
};

export default StatCard;