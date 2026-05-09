"use client"

import { useI18n } from "@core/lib/contexts/I18nContext";
import { useChatsLoad } from "@core/lib/hooks/chat/useChatsLoad";
import { useChatSubscription } from "@core/lib/hooks/chat/useChatSubscription";
import AccountHeader from "@/components/pages/account/AccountHeader/AccountHeader";
import ChatsPage from "@/components/ui/chat/ChatsPage/ChatsPage";

const MessengerPage = () => {

    useChatSubscription();
    useChatsLoad();

    const { dict } = useI18n();

    return (
        <>
            <AccountHeader title={dict.common.titles.messenger} />

            <ChatsPage />
        </>
    );
};

export default MessengerPage;