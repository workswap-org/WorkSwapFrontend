"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./ActionMenu.module.scss";

export interface IKebabAction {
    title: string,
    func: () => void,
    icon?: string,
    access?: boolean
};

const ActionMenu = ({actions}: {actions: IKebabAction[]}) => {

    const [isOpen, setOpen] = useState(false);
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

    return filtered.length > 0 && (
        <div className={styles.menu} ref={menuRef}>
            <button className="hover" onClick={() => setOpen(prev => !prev)}>
                <i className="fa-solid fa-ellipsis-vertical fa-lg"></i>
            </button>
            <div className={`${styles.list} ${isOpen ? "active" : ""}`}>
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
            </div>
        </div>
    )
}

export default ActionMenu;