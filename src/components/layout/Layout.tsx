import { Outlet } from "react-router-dom";
import { Header } from "@/components";
import { LanguageSelectModal } from "@core/components";
import { useAuth, useChatSubscription, useChatsLoad } from '@core/lib';

export default function Layout() {

    const { isAuthenticated} = useAuth();

    if (isAuthenticated) {
        useChatSubscription();
        useChatsLoad();
    }

    return (
        <>
            <Header />

            <Outlet />

            <LanguageSelectModal />
        </>
    );
}