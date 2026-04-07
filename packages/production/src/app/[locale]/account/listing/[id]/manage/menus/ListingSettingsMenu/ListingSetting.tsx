import React, { ReactNode, useMemo, useState } from "react";

interface ListingSettingProps {
    title: string;
    children: ReactNode;
}
const ListingSetting = ({ title, children}: ListingSettingProps) => {

    const [active, setActive] = useState<boolean>(false);

    const validChildren = useMemo(
        () => React.Children.toArray(children).filter(Boolean),
        [children]
    );

    if (validChildren.length === 0) return null;

    return (
        <div className="listing-setting">
            <div className="listing-setting-header" onClick={() => setActive(!active)}>
                <h3>{title}</h3>
            </div>
            <div className={`listing-setting-body ${active ? "active" : ""}`}>
                <div>
                    {children} 
                </div>
            </div>
        </div>
    );
}
export default ListingSetting;