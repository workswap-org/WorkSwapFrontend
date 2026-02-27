import { autoGrow } from "../../../lib";

const TextareaRT1 = ({
    value,
    setValue,
    className = "",
    placeholder = "",
    disabled,
    onKeyDown
}: {
    value: string;
    setValue: (value: string) => void;
    className?: string;
    placeholder: string;
    disabled?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) => {

    return (
        <textarea 
            className={`rt1 ${className ? className : ""}`}
            value={value}
            onChange={(e) => {
                setValue(e.target.value)
                autoGrow(e)
            }}
            placeholder={placeholder}
            disabled={disabled}
            onKeyDown={onKeyDown}
        />
    );
}

export default TextareaRT1;