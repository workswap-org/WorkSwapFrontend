import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import AccountLayout from "./layouts/AccountLayout";

import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import LoginSuccessPage from "./pages/LoginSuccessPage";
import AccountPage from "./pages/AccountPage";
import MyListingsPage from "./pages/MyListingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import MessengerPage from "./pages/MessengerPage";
import SettingsPage from "./pages/SettingsPage";
import ListingPage from "./pages/ListingPage";
import ProfilePage from "./pages/ProfilePage";
import ListingEditPage from "./pages/ListingEditPage";
import ListingCreatePage from "./pages/ListingCreatePage";

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
                            <Route path="listing/edit/:id" element={<ListingEditPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;