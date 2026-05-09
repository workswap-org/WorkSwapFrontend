"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom";
import styles from "./ActionMenu.module.scss";
import EllipsisVerticalIcon from "@core/components/common/icons/EllipsisVerticalIcon";

export interface IKebabAction {
    title: string,
    func: () => void,
    icon?: string,
    access?: boolean
};

const ActionMenu = ({actions, className}: {actions: IKebabAction[], className?: string}) => {

    const [isOpen, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const filtered = actions.filter(a => a.access ?? true)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const openMenu = () => {
        const rect = buttonRef.current?.getBoundingClientRect();

        if (!rect) return;

        setCoords({
            top: rect.bottom + 4,
            left: rect.left
        });

        setOpen(true);
    };

    const modalRoot = document.getElementById("modal-root");

    return filtered.length > 0 && (
        <div className={`${styles.wrapper} ${className}`}>
            <div className={`${styles.menu}`} ref={menuRef}>
                <button 
                    ref={buttonRef}
                    className={`${styles.button} hover`} 
                    onClick={() => isOpen ? setOpen(false) : openMenu()}
                >
                    <EllipsisVerticalIcon className={styles.icon} />
                </button>
                {isOpen && modalRoot && createPortal(
                    <div 
                        style={{
                            position: "fixed",
                            top: coords.top,
                            left: coords.left
                        }}
                        className={styles.list}
                    >
                        {filtered.map((action) => (
                            <button 
                                key={action.title} 
                                onClick={() => {
                                    action.func()
                                    setOpen(false)
                                }}
                                className="hover"
                            >
                                {action.icon && (<div><i className={`fa-regular fa-${action.icon} fa-lg`}/></div>)}
                                {action.title}
                            </button>
                        ))}
                    </div>,
                    modalRoot
                )}
            </div>
        </div>
    )
}

export default ActionMenu;