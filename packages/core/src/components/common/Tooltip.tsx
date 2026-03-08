"use client"

import { ReactNode, useRef, useState } from "react";

interface Props {
    text: string;
    delay?: number;
    children: ReactNode;
}

const Tooltip = ({ text, delay = 500, children }: Props) => {
    const [visible, setVisible] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showTip = () => {
        timeoutRef.current = setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const hideTip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
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