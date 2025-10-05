import { useRef, useState } from "react";

const Tooltip = ({ text, delay = 500, children }) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    const showTip = () => {
        timeoutRef.current = setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const hideTip = () => {
        clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    return (
        <div 
            className="tooltip-wrapper"
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {children}
            {visible && <div className="tooltip-box">{text}</div>}
        </div>
    );
};

export default Tooltip;