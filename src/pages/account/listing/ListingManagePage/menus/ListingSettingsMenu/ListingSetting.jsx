import React, { useState } from "react";

const ListingSetting = ({ title, children}) => {

    const [active, setActive] = useState(false);

    const validChildren = React.Children.toArray(children).filter(c => c !== null && c !== false);

    if (validChildren.length === 0) return null;

    return (
        <div className="listing-setting">
            <div className="header" onClick={() => setActive(!active)}>
                <h3>{title}</h3>
            </div>
            <div className={`body ${active ? "active" : ""}`}>
                <div>
                    {children} 
                </div>
            </div>
        </div>
    );
}
export default ListingSetting;