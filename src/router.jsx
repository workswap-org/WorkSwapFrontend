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

                    {/* приватные страницы */}
                    <Route path="secure" element={<PrivateRoute />}>
                        <Route element={<AccountLayout />}>
                            <Route path="account" element={<AccountPage />} />
                            <Route path="my-listings" element={<MyListingsPage />} />
                            <Route path="favorites" element={<FavoritesPage />} />
                            <Route path="messenger" element={<MessengerPage />} /> 
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;