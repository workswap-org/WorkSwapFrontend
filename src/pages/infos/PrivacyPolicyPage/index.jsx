import "@/css/pages/terms-page.css";
import { useEffect, useState } from "react";

const PrivacyPolicyPage = () => {

    const [privacyPolicy, setPrivacyPolicy] = useState("");

    useEffect(() => {
        async function loadPrivacyPolicy() {
            const data = await fetch('https://cloud.workswap.org/info/privacy-policy.txt')
            setPrivacyPolicy(await data.text());
        }

        loadPrivacyPolicy();
    }, [])

    return (
        <div className="terms-page">
            {privacyPolicy}
        </div>
    );
};

export default PrivacyPolicyPage;