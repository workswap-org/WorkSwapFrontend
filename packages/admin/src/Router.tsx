import { 
    Routes, 
    Route,
    Navigate
} from "react-router-dom";

import Layout from "./components/layout/Layout";

import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import PermissionsPage from "./pages/PermissionsPage";
import UsersPage from "./pages/users/UsersPage"

/* Страницы логина */
import {
    LoginPage,
    RegisterPage,
    LoginSuccessPage,
    LogoutPage
} from "@core/pages";

import {
    PrivateRoute,
    AuthGuard
} from "@core/routes";
import { UserControlPage } from "./pages";

const AppRouter = () => {
    return (
        <>
            <Routes>

                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Один общий Layout */}
                <Route path="/" element={<Layout />}>

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login/success" element={<LoginSuccessPage />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    
                    <Route path="/" element={<AuthGuard />}>
                        {/* публичные страницы */}

                        <Route element={<PrivateRoute />}>

                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="categories" element={<CategoriesPage />} />
                            <Route path="permissions" element={<PermissionsPage />} />
                            <Route path="tasks" element={<TasksPage />} />
                            <Route path="users">
                                <Route index element={<UsersPage />} />
                                <Route path=":userOpenId" element={<UserControlPage />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;