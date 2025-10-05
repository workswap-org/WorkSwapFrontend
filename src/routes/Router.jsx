import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import AccountLayout from "@/components/layout/AccountLayout";

/* Страницы */
import CatalogPage from "@/pages/CatalogPage";
import ListingPage from "@/pages/ListingPage";
import ProfilePage from "@/pages/ProfilePage";

/* Страницы логина */
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/login/RegisterPage";
import LoginSuccessPage from "@/pages/login/LoginSuccessPage";
import LogoutPage from "@/pages/login/LogoutPage";

/* Страницы информации */
import TermsPage from "@/pages/infos/TermsPage";
import PrivacyPolicyPage from "@/pages/infos/PrivacyPolicyPage";

/* Страницы аккаунта */
import AccountPage from "@/pages/account/AccountPage";
import MyListingsPage from "@/pages/account/MyListingsPage";
import FavoritesPage from "@/pages/account/FavoritesPage";
import MessengerPage from "@/pages/account/MessengerPage";
import SettingsPage from "@/pages/account/SettingsPage";
import SecurityPage from "@/pages/account/SecurityPage";

/* Страницы управления объявлениями */
import ListingEditPage from "@/pages/account/listing/ListingEditPage";
import ListingCreatePage from "@/pages/account/listing/ListingCreatePage";
import ListingDraftsPage from "@/pages/account/listing/ListingDraftsPage";

import PrivateRoute from "./PrivateRoute";
import AuthGuard from "@/lib/contexts/auth/AuthGuard";
import RouteLogger from "@/components/logging/RouteLogger";
import ChatStartPage from "@/pages/ChatStartPage";

const AppRouter = () => {
    return (
        <>
            <RouteLogger />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="login/success" element={<LoginSuccessPage />} />
                    <Route path="logout" element={<LogoutPage />} />
                    <Route index element={<Navigate to="/catalog" replace />} />

                    <Route path="terms" element={<TermsPage />} />
                    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

                    {/* Один общий Layout */}
                    <Route element={<AuthGuard />}>
                            {/* публичные страницы */}
                        <Route path="catalog" element={<CatalogPage />} />
                        <Route path="listing/:id" element={<ListingPage />} />
                        <Route path="profile/:id" element={<ProfilePage />} />

                        {/* приватные страницы */}
                        <Route path="secure" element={<PrivateRoute />}>
                            <Route element={<AccountLayout />}>
                            
                                <Route index element={<Navigate to="/secure/my-listings" replace />} />
                                {/* <Route path="account" element={<AccountPage />} /> */}
                                <Route path="account" element={<Navigate to="/secure/my-listings" replace />} />

                                <Route path="my-listings" element={<MyListingsPage />} />
                                <Route path="favorites" element={<FavoritesPage />} />
                                <Route path="messenger" element={<MessengerPage />} /> 
                                <Route path="settings" element={<SettingsPage />} />
                                <Route path="security" element={<SecurityPage />} />

                                <Route path="chat-start" element={<ChatStartPage />} />
                                <Route path="listing/create" element={<ListingCreatePage />} />
                                <Route path="listing/drafts" element={<ListingDraftsPage />} />
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