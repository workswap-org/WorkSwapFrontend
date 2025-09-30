import { useTranslation } from "react-i18next";

const FormattedDate = ({ isoDate }) => {
    const { i18n } = useTranslation();
    const locale = i18n.language || "fi";
    if (!isoDate) return null;

    const date = new Date(isoDate);

    const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    const formatted = new Intl.DateTimeFormat(locale, options).format(date);

    return <span>{formatted}</span>;
};

export default FormattedDate;