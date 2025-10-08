import { Outlet } from "react-router-dom";
import {Header} from "@/components";
import {LanguageSwitcher} from "@core/components";

export default function Layout() {

    return (
        <>
            <Header />

            <Outlet />

            <LanguageSwitcher/>
        </>
    );
}