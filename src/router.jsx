import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";

import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import LoginSuccessPage from "./pages/LoginSuccessPage";
import AccountPage from "./pages/AccountPage";

import PrivateRoute from "./components/PrivateRoute";
import RouteLogger from "./components/logging/RouteLogger";
import { Navigate } from "react-router-dom";
import AccountLayout from "./layouts/AccountLayout";

const AppRouter = () => {
    return (
        <>
            <RouteLogger />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/success" element={<LoginSuccessPage />} />
                <Route index element={<Navigate to="/catalog" replace />} />

                <Route
                    path="/"
                    element={
                        <Layout />
                    }
                >
                    <Route path="catalog" element={<CatalogPage />} />

                    {/* <Route path="categories" element={<CategoriesPage />} /> */}
                </Route>


                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout/>
                        </PrivateRoute>
                    }
                >

                    <Route path="secure" element={<AccountLayout />}>
                        <Route path="account" element={<AccountPage />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;