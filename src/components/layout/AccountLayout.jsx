import AccountSidebar from "@/components/layout/sidebar/account/AccountSidebar";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {

    return (
        <>
            <div className="account-container">
                <div className="account-layout">

                    <AccountSidebar/>

                    <main className="account-main">

                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default AccountLayout;