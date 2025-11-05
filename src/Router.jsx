import { 
    Routes, 
    Route,
    Navigate
} from "react-router-dom";

import {
    Layout,
    AccountLayout
} from "@/components";

/* Страницы */
import {
    CatalogPage,

    /* Страницы items */
    ListingPage,
    ProfilePage,
    EventPage,

    /* Страницы информации */
    TermsPage,
    PrivacyPolicyPage,

    /* Страницы аккаунта */
    AccountPage,
    MyListingsPage,
    FavoritesPage,
    MessengerPage,
    SettingsPage,
    SecurityPage,

    /* Страницы управления объявлениями */
    ListingEditPage,
    ListingCreatePage,

    ChatStartPage
} from "@/pages";

/* Страницы логина */
import {
    LoginPage,
    RegisterPage,
    RegisterOauthPage,
    LoginSuccessPage,
    LogoutPage
} from "@core/pages";

import {
    PrivateRoute,
    AuthGuard
} from "@core/routes";

const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="register/oauth" element={<RegisterOauthPage />} />
                    <Route path="login/success" element={<LoginSuccessPage />} />
                    <Route path="logout" element={<LogoutPage />} />
                    <Route index element={<Navigate to="/catalog" replace />} />

                    <Route path="terms" element={<TermsPage />} />
                    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

                    {/* Один общий Layout */}
                    <Route element={<AuthGuard />}>
                            {/* публичные страницы */}
                        <Route path="catalog" element={<CatalogPage />} />
                        <Route path="event/:eventId" element={<EventPage />} />
                        <Route path="listing/:listigId" element={<ListingPage />} />
                        <Route path="profile/:userId" element={<ProfilePage />} />

                        {/* приватные страницы */}
                        <Route path="account" element={<PrivateRoute />}>
                            <Route element={<AccountLayout />}>
                            
                                <Route index element={<Navigate to="/account/my-listings" replace />} />
                                {/* <Route path="account" element={<AccountPage />} /> */}
                                <Route path="account" element={<Navigate to="/account/my-listings" replace />} />

                                <Route path="my-listings" element={<MyListingsPage />} />
                                <Route path="favorites" element={<FavoritesPage />} />
                                <Route path="messenger" element={<MessengerPage />} /> 
                                <Route path="settings" element={<SettingsPage />} />
                                <Route path="security" element={<SecurityPage />} />

                                <Route path="chat-start" element={<ChatStartPage />} />
                                <Route path="listing/create" element={<ListingCreatePage />} />
                                <Route path="listing/edit/:id" element={<ListingEditPage />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;