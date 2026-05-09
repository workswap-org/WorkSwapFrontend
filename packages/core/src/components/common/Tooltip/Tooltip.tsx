"use client"

import { ReactNode, useRef, useState } from "react";
import styles from "./Tooltip.module.scss";
import { createPortal } from "react-dom";

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

    const modalRoot = document.getElementById("modal-root");
    
    return (
        <div 
            className={styles.wrapper}
            onMouseEnter={showTip}
            /* onMouseLeave={hideTip} */
        >
            {children}
            {visible && modalRoot && createPortal(<div className={styles.box}>{text}</div>, modalRoot)}
        </div>
    );
};

export default Tooltip;