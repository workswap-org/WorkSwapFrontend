import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import AccountLayout from "./layouts/AccountLayout";

/* Страницы */
import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import LoginSuccessPage from "./pages/LoginSuccessPage";
import ListingPage from "./pages/ListingPage";
import ProfilePage from "./pages/ProfilePage";

/* Страницы аккаунта */
import AccountPage from "./pages/account/AccountPage";
import MyListingsPage from "./pages/account/MyListingsPage";
import FavoritesPage from "./pages/account/FavoritesPage";
import MessengerPage from "./pages/account/MessengerPage";
import SettingsPage from "./pages/account/SettingsPage";

/* Страницы управления объявлениями */
import ListingEditPage from "./pages/account/listing/ListingEditPage";
import ListingCreatePage from "./pages/account/listing/ListingCreatePage";
import ListingDraftsPage from "./pages/account/listing/ListingDraftsPage";

import PrivateRoute from "./components/PrivateRoute";
import RouteLogger from "./components/logging/RouteLogger";

const AppRouter = () => {
    return (
        <>
            <RouteLogger />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/success" element={<LoginSuccessPage />} />
                <Route index element={<Navigate to="/catalog" replace />} />

                {/* Один общий Layout */}
                <Route path="/" element={<Layout />}>
                    {/* публичные страницы */}
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="listing/:id" element={<ListingPage />} />
                    <Route path="profile/:id" element={<ProfilePage />} />

                    <Route element={<PrivateRoute />}>
                        
                    </Route>

                    {/* приватные страницы */}
                    <Route path="secure" element={<PrivateRoute />}>
                        <Route element={<AccountLayout />}>
                        
                            <Route path="account" element={<AccountPage />} />
                            <Route path="my-listings" element={<MyListingsPage />} />
                            <Route path="favorites" element={<FavoritesPage />} />
                            <Route path="messenger" element={<MessengerPage />} /> 
                            <Route path="settings" element={<SettingsPage />} />

                            <Route path="listing/create" element={<ListingCreatePage />} />
                            <Route path="listing/drafts" element={<ListingDraftsPage />} />
                            <Route path="listing/edit/:id" element={<ListingEditPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;