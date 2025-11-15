import { useState } from "react";

const ListingSetting = ({ title, children}) => {

    const [active, setActive] = useState(false);

    return (
        <div className="listing-setting">
            <div className="header" onClick={() => setActive(!active)}>
                <h3>{title}</h3>
            </div>
            <div className={`body ${active ? "active" : ""}`}>
                {children}
            </div>
        </div>
    );
}
export default ListingSetting;