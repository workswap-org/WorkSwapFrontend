import { useEffect, useState } from "react";

const PrivacyPolicyPage = () => {

    const [terms, setTerms] = useState("");

    useEffect(() => {
        async function loadTerms(params) {
            const data = await fetch('https://cloud.workswap.org/info/tems.txt')
            console.log(data);
            setTerms(await data);
        }
    }, [])

    return (
        <div>
            {terms}
        </div>
    );
};

export default PrivacyPolicyPage;