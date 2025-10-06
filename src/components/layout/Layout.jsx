import { Outlet } from "react-router-dom";
import Header from "@/components/layout/header/Header";
import LanguageSwitcher from "@core/components/layout/LanguageSwitcher";

export default function Layout() {

    return (
        <>
            <Header />

            <Outlet />

            <LanguageSwitcher/>
        </>
    );
}