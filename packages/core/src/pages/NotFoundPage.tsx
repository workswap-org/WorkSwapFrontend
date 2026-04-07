"use client"

import { useRouter } from "next/navigation";
import { useI18n } from "@core/lib/contexts/I18nContext";

const NotFoundPage = () => {

    const router = useRouter();
    const { dict } = useI18n();

    return (
        <div className="body-center">
            <div className='card' style={{height: 'fit-content'}}>
                <div className='body'>
                    <h1>{dict.common.fallbacks.pageNotFound}</h1>
                    <button onClick={() => router.back()} className="btn btn-primary">
                        <i className="fa-solid fa-left"></i>
                        {dict.navigation.back}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;