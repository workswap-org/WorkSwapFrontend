import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';

const LocationSelector = ({ locationId, onChange }) => {
    
    const { t } = useTranslation('common');

    const [locations, setLocations] = useState([]);
    const [selectedPath, setSelectedPath] = useState([]);

    useEffect(() => {
        async function loadLocations() {
            const data = await apiFetch("/api/locations");

            const locs = data.locations || [];
            setLocations(locs);

            // если уже есть categoryId → восстановим путь
            if (locationId) {
                const path = findPathToLocation(locs, locationId);
                setSelectedPath(path);
            }
        }

        function findPathToLocation(locations, locationId) {
            console.log(locationId)
            const loc = locations.find(l => l.id === locationId);
            if (!loc) return [];

            // если есть parentId → рекурсивно ищем путь к родителю
            if (loc.countryId) {
                // сначала путь до страны, потом сам город
                return [...findPathToLocation(locations, loc.countryId), loc.id];
            } else {
                // это страна
                return [loc.id];
            }
        }

        loadLocations();
    }, [locationId]);

    // нормализуем сравнение
    const getChildren = (countryId) =>
        locations.filter((c) => c.countryId === countryId);

    const handleSelect = (level, value) => {
        const newPath = [...selectedPath.slice(0, level), value];
        setSelectedPath(newPath);

        if (onChange) {
            onChange(value, newPath); // пробрасываем выбранный id и путь
        }
    };

    const renderSelectors = () => {
        const selectors = [];
        let countryId = null;

        for (let level = 0; ; level++) {
            const children = getChildren(countryId);
            if (children.length === 0) break;

            const selected = selectedPath[level] || "";
            selectors.push(
                <select
                    key={level}
                    id="locationSelector"
                    value={selected}
                    onChange={(e) => handleSelect(level, Number(e.target.value))}
                >
                    <option value="" disabled>
                        {t(`placeholders.location`, { ns: 'common' })}
                    </option>
                    {children.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
            );

            if (!selected) break; // пока не выбрали — дальше не идём
            countryId = selected;
        }

        return selectors;
    };

    return <>{renderSelectors()}</>;
};

export default LocationSelector;