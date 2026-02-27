import { useTranslation } from "react-i18next";

interface Props {
    isoDate: string;
    format?: string;
}

export const FormattedDate = ({ isoDate, format = "DMYHM"}: Props) => {
    const { i18n } = useTranslation();
    const locale = i18n.language || "fi";
    if (!isoDate) return null;

    const date = new Date(isoDate);

    let options = {};

    if (format === "DM") {
        options = {
            day: "2-digit",
            month: "long"
        };
    } else if (format === "DMY") {
        options = {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        };
    } else if (format === "DMHM") {
        options = {
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
        };
    } else if (format === "DMYHM") {
        options = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
    }

    const formatted = new Intl.DateTimeFormat(locale, options).format(date);

    return <span>{formatted}</span>;
};