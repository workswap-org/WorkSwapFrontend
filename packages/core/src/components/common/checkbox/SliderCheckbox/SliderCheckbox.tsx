import { ChangeEvent, ReactNode } from "react";
import styles from "./SliderCheckbox.module.scss"

interface SliderCheckboxProps {
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
    id: string;
    options:
        | ReactNode
        | {
            checked: ReactNode;
            unchecked: ReactNode;
        };
}

const SliderCheckbox = ({
    checked,
    onChange,
    id,
    options
}: SliderCheckboxProps) => {

    const isOptionsObject =
        typeof options === "object" &&
        options !== null &&
        "checked" in options &&
        "unchecked" in options;

    return (
        <div className={styles.toggle}>
            <label className={styles.switch}>
                <input 
                    id={`${id}-checkbox`}
                    type="checkbox" 
                    checked={checked}
                    onChange={(e) => onChange(e)}
                    value="true"
                />
                <span className={styles.slider}></span>
            </label>
            <p>
                {isOptionsObject
                    ? checked
                        ? options.checked
                        : options.unchecked
                    : options}
            </p>
        </div>
    )
}

export default SliderCheckbox