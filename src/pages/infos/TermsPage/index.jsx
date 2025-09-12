import "#/css/public/pages/terms-page.css";
import { useEffect, useState } from "react";

const TermsPage = () => {

    const [terms, setTerms] = useState("");

    useEffect(() => {
        async function loadTerms() {
            const data = await fetch('https://cloud.workswap.org/info/tems.txt')
            setTerms(await data.text());
        }

        loadTerms();
    }, [])

    return (
        <div className="terms-page">
            {terms}
        </div>
    );
};

export default TermsPage;