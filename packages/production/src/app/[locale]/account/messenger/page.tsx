"use client"

import { useI18n } from "@core/lib/common/contexts/I18nContext";
import { useChatsLoad } from "@core/lib/chat/hooks/useChatsLoad";
import { useChatSubscription } from "@core/lib/chat/hooks/useChatSubscription";
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