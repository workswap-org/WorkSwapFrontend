import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicyPage = () => {

    const { i18n } = useTranslation();
    const userLocale = i18n.language || "fi";

    const [privacyPolicy, setPrivacyPolicy] = useState("");

    useEffect(() => {
        async function loadPrivacyPolicy() {
            const data = await fetch(`https://cloud.workswap.org/info/privacy-policy_${userLocale}.txt`)
            setPrivacyPolicy(await data.text());
        }

        loadPrivacyPolicy();
    }, [userLocale])

    return (
        <div className="terms-page">
            <div>{privacyPolicy}</div>
        </div>
    );
};

export default PrivacyPolicyPage;