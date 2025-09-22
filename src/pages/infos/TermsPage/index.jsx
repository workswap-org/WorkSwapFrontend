import "@/css/pages/terms-page.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TermsPage = () => {

    const { i18n } = useTranslation();
    const userLocale = i18n.language || "fi";

    const [terms, setTerms] = useState("");

    useEffect(() => {
        async function loadTerms() {
            const data = await fetch(`https://cloud.workswap.org/info/terms_${userLocale}.txt`)
            setTerms(await data.text());
        }

        loadTerms();
    }, [userLocale])

    return (
        <div className="terms-page">
            {terms}
        </div>
    );
};

export default TermsPage;