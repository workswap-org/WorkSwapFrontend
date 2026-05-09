import { ChangeEvent } from "react";
import styles from "./SwitchToggler.module.scss"

interface SwitchTogglerProps {
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
    className?: string;
}

export default function SwitchToggler({checked, onChange, className}: SwitchTogglerProps) {
    return (
        <label className={`${styles.switch} ${className}`}>
            <input 
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e)}
            />
            <span className={styles.slider}>
                <i className="fa-solid fa-check" style={{color: 'lightgreen'}}></i>
                <i className="fa-solid fa-xmark" style={{color: 'rgb(184, 94, 94)'}}></i>
            </span>
        </label>
    )
}