import { Outlet } from "react-router-dom";
import { Header } from "@/components";
import { LanguageSelectModal } from "@core/components";
import { useChatSubscription, useChatsLoad } from '@core/lib';

export default function Layout() {

    useChatSubscription();
    useChatsLoad();

    return (
        <>
            <Header />

            <Outlet />

            <LanguageSelectModal />
        </>
    );
}